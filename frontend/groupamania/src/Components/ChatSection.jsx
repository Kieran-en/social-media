import React, { useState } from 'react'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'

function ChatSection() {
  const [currentConversation, setCurrentConversation] = useState()
  
  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
      <Message own={true}/>
      <Message />
      <Message own={true}/>
      <Message />
      </div>
      <div className={styles.chatBottom}>
        <SendMessage />
      </div>
    </div>
  )
}

export default ChatSection