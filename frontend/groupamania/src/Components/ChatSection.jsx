import React from 'react'
import Message from './Message'
import styles from '../Styles/chat.module.css'

function ChatSection() {
  return (
    <div className={styles.box}>
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  )
}

export default ChatSection