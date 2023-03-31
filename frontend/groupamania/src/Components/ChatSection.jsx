import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'
import { getSpecificConversation } from '../Services/conversationService'

function ChatSection() {
  const [currentConversation, setCurrentConversation] = useState()
  const {data : conversation} = useQueryClient('conversation', () => getSpecificConversation())

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