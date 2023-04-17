import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import styles from '../Styles/messagePage.module.css'
import FriendSection from '../Components/FriendSection'
import ChatSection from '../Components/ChatSection'
import OnlineSection from '../Components/OnlineSection'
import { useQuery } from 'react-query'
import { getCurrentUser, getFriends } from '../Services/userService'
import { useSelector } from 'react-redux'

function MessagePage() {

  const token = useSelector(state => state.token)
  const userData = getCurrentUser(token)
  const { username } = userData;
  const {error, status, data: friends} = useQuery('friends', () => getFriends(username))

  return (
    <div>
        <NavBar />
        <div className={styles.grid}>
            <div className={styles.friend_section}><FriendSection friends={friends} /></div>
            <div className={styles.chat_section}><ChatSection loggedinUserData={userData}/></div>
            <div className={styles.online_section}><OnlineSection /></div>
        </div>
    </div>
  )
}

export default MessagePage