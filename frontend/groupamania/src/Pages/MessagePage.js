import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import styles from '../Styles/messagePage.module.css'
import FriendSection from '../Components/FriendSection'
import ChatSection from '../Components/ChatSection'
import OnlineSection from '../Components/OnlineSection'
import { useQuery } from 'react-query'
import { getCurrentUser, getFriends } from '../Services/userService'

function MessagePage() {

  const userData = getCurrentUser()
  const { username } = userData;
  const {error, status, data: friends} = useQuery('friends', () => getFriends(username))

  return (
    <div>
        <NavBar />
        <div className={styles.grid}>
            <div className={styles.friend_section}><FriendSection friends={friends} /></div>
            <div className={styles.chat_section}><ChatSection senderData={userData}/></div>
            <div className={styles.online_section}><OnlineSection /></div>
        </div>
    </div>
  )
}

export default MessagePage