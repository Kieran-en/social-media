import React, {useEffect, useRef} from 'react'
import { useQueryClient, useQuery } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'

function ChatSection({loggedinUserData}) {
  const conversation = useSelector((state) => state.conversation)
  const { id: conversationId } = conversation
  const {userId: loggedinUserId} = loggedinUserData
  const {data : messages} = useQuery('messages', () => getMessages(conversationId))
  const scrollRef = useRef()

  useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages])

  console.log(conversation)
  console.log(messages)

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        messages && messages.map(message => ( 
          <div ref={scrollRef}>
            <Message key={message && message.id} own={message && message.senderId == loggedinUserId ? true : false}
          text={message && message.text} 
          timeSent={message && message.createdAt} />
          </div>
        )
         )}
      </div>
      <div className={styles.chatBottom}>
        <SendMessage conversationId={conversationId} senderId={loggedinUserId}/>
      </div>
    </div>
  )
}

export default ChatSection