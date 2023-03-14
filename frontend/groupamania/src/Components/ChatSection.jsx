import React from 'react'
import Message from './Message'
import styles from '../Styles/chat.module.css'

function ChatSection() {
  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
      <Message own={true}/>
      <Message />
      <Message own={true}/>
      <Message />
      </div>
      <div className={styles.chatBottom}>
        
      </div>
    </div>
  )
}

export default ChatSection