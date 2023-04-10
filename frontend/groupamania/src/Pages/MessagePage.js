import React, { useState } from 'react'
import NavBar from '../Components/NavBar'
import styles from '../Styles/messagePage.module.css'
import FriendSection from '../Components/FriendSection'
import ChatSection from '../Components/ChatSection'
import OnlineSection from '../Components/OnlineSection'
import { ConversationContext } from '../Context/ConversationContext'
import { useQuery } from 'react-query'
import { getCurrentUser, getFriends } from '../Services/userService'

function MessagePage() {


  const [currentChat, setCurrentChat] = useState();
  const userData = getCurrentUser()
  const { username } = userData;
  const {error, status, data: friends} = useQuery('friends', () => getFriends(username))

  return (
    <div>
        <NavBar />
        <ConversationContext.Provider value={[currentChat, setCurrentChat]}>
        <div className={styles.grid}>
            <div className={styles.friend_section}><FriendSection friends={friends} updateCurrentChat={setCurrentChat} /></div>
            <div className={styles.chat_section}><ChatSection senderData={userData} updateCurrentChat={setCurrentChat}/></div>
            <div className={styles.online_section}><OnlineSection /></div>
        </div>
        </ConversationContext.Provider>
    </div>
  )
}

export default MessagePage