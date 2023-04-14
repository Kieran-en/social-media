import React from 'react'
import { useQueryClient, useQuery } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'

function ChatSection({loggedinUserData}) {
  const conversation = useSelector((state) => state.conversation)
  const { id: conversationId } = conversation
  const {loggedinUserId} = loggedinUserData
  const {data : messages} = useQuery('messages', () => getMessages(conversationId))

  console.log(conversation)
  console.log(messages)

  console.log(loggedinUserId)

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        messages.map(message => (
          <Message own={message && message.UserId == loggedinUserId ? true : false}
           text={message && message.text} 
           timeSent={message && message.createdAt} />
        ))
         }
      </div>
      <div className={styles.chatBottom}>
        <SendMessage />
      </div>
    </div>
  )
}

export default ChatSection