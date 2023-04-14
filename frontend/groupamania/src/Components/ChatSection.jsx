import React from 'react'
import { useQueryClient } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'
import { getMessages } from '../Services/messageService'

function ChatSection({senderData}) {
  const conversation = useSelector((state) => state.conversation)
  const {senderId} = senderData
  const {data : messages} = useQueryClient('message', () => getMessages())

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
         <Message own={true}/>
         }
      </div>
      <div className={styles.chatBottom}>
        <SendMessage />
      </div>
    </div>
  )
}

export default ChatSection