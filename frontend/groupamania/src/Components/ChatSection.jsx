import React, {useEffect, useRef, useState} from 'react'
import { useQueryClient, useQuery } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'

function ChatSection({loggedinUserData, socket}) {

  const conversation = useSelector((state) => state.conversation)
  const { id: conversationId, receiverId, senderId } = conversation
  const {userId: loggedinUserId} = loggedinUserData
  const {data : messages} = useQuery('messages', () => getMessages(conversationId))
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef = useRef()

  useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])

 
  useEffect(() => {
    socket.current && socket.current.on('getMessage', ({senderId, text}) => {
      setArrivalMessage({
        senderId,
        text,
        createdAt: Date.now()
      })
    })
  })

  useEffect(() => {
    //arrivalMessage && conversation?.senderId === arrivalMessage.senderId && messages.push(arrivalMessage)
  }, [])
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages])

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        messages && messages.map(message => ( 
          <div ref={scrollRef} key={message && message.id}>
            <Message key={message && message.id} own={message && message.senderId == loggedinUserId ? true : false}
          text={message && message.text} 
          timeSent={message && message.createdAt} />
          </div>
        )
         )}
      </div>
      <div className={styles.chatBottom}>
        <SendMessage conversationId={conversationId} senderId={loggedinUserId} receiverId={receiverId} socket={socket}/>
      </div>
    </div>
  )
}

export default ChatSection