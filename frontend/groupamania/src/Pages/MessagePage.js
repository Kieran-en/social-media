import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import NavBar from '../Components/NavBar'
import FriendSection from '../Components/FriendSection'
import ChatSection from '../Components/ChatSection'
import OnlineSection from '../Components/OnlineSection'
import { getCurrentUser, getFriends } from '../Services/userService'
import styles from '../Styles/messagePage.module.css'

function MessagePage() {
  const token = useSelector(state => state.token)
  const conversation = useSelector(state => state.conversation) // 👈 pour savoir si un chat est actif
  const socket = useRef(null)

  const userData = getCurrentUser(token)
  const { username, userId, profileImg } = userData

  const [onlineUsersIds, setOnlineUsersIds] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const { data: friends } = useQuery('friends', () => getFriends(username))

  useEffect(() => {
    socket.current = io('http://localhost:5500')
    return () => socket.current.disconnect()
  }, [])

  useEffect(() => {
    if (!socket.current) return
    socket.current.emit('addUser', { userId, username, profileImg })
    socket.current.on('getUsers', (users) => {
      setOnlineUsersIds(users.map(user => user.userId))
    })
    return () => socket.current.off('getUsers')
  }, [userId, username, profileImg])

  useEffect(() => {
    if (friends) {
      const online = friends.filter(friend => onlineUsersIds.includes(friend.id))
      setOnlineFriends(online)
    }
  }, [friends, onlineUsersIds])

  // Suivre la taille de l’écran
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = screenWidth <= 768
  const isTablet = screenWidth > 768 && screenWidth <= 1024

  return (
    <div>
      <NavBar />
      <div className={styles.grid}>
        {(isMobile && !conversation.id) || isTablet || (!isMobile && !isTablet) ? (
          <div className={styles.friend_section}>
            <FriendSection friends={friends} socket={socket} />
          </div>
        ) : null}

        {(isMobile && conversation.id) || isTablet || (!isMobile && !isTablet) ? (
          <div className={styles.chat_section}>
            <ChatSection loggedinUserData={userData} socket={socket} />
          </div>
        ) : null}

        {!isMobile && !isTablet && (
          <div className={styles.online_section}>
            <OnlineSection onlineUsers={onlineFriends} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagePage
