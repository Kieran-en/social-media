import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'
import { getSpecificConversation } from '../Services/conversationService'
import { getMessages } from '../Services/messageService'

function ChatSection({senderData}) {
  const conversation = useSelector((state) => state.conversation)
  const {senderId} = senderData
  const [currentConversation, setCurrentConversation] = useState()
  const {data : messages} = useQueryClient('message', () => getMessages())
  //const {data : conversation} = useQueryClient('conversation', () => getSpecificConversation())
  console.log(conversation)

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