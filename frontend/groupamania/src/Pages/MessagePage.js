import React, { useEffect, useRef } from 'react'
import NavBar from '../Components/NavBar'
import styles from '../Styles/messagePage.module.css'
import FriendSection from '../Components/FriendSection'
import ChatSection from '../Components/ChatSection'
import OnlineSection from '../Components/OnlineSection'
import { useQuery } from 'react-query'
import { getCurrentUser, getFriends } from '../Services/userService'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useState } from 'react'

function MessagePage() {

  const token = useSelector(state => state.token)
  const socket = useRef()
  const userData = getCurrentUser(token)
  const { username, userId, profileImg } = userData;
  const [onlineUsersIds, setOnlineUsersIds] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const {error, status, data: friends} = useQuery('friends', () => getFriends(username))

//To avoid a connection from happening everytime the page re-renders
  useEffect(() => {
    socket.current = (io('http://localhost:5500'))
  }, [])


  useEffect(() => {
    socket.current.emit('addUser', {userId, username, profileImg})

    socket.current.on('getUsers', users => {
      setOnlineUsersIds(users.map(user => user.userId)) //Mapping online users Ids
      //let userFriendsOnline = friends && friends.filter(friend => onlineUsersIds.includes(friend.userId))
      //console.log(users)
    })

  }, [token]) //called anytime a new user is loggedIn

  useEffect(() => {
    setOnlineFriends(friends && friends.filter(friend => onlineUsersIds.includes(friend.id)))
  }, [onlineUsersIds])

  console.log(friends)
  console.log(onlineFriends)

  return (
    <div>
        <NavBar />
        <div className={styles.grid}>
            <div className={styles.friend_section}><FriendSection friends={friends} socket={socket}/></div>
            <div className={styles.chat_section}><ChatSection loggedinUserData={userData} socket={socket}/></div>
            <div className={styles.online_section}><OnlineSection onlineUsers={onlineFriends}/></div>
        </div>
    </div>
  )
}

export default MessagePage