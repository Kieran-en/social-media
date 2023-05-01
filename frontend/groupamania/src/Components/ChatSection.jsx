import React, {useEffect, useRef, useState} from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'

function ChatSection({loggedinUserData, socket}) {

  const conversation = useSelector((state) => state.conversation)
  const { id: conversationId, receiverId, senderId } = conversation
  const {userId: loggedinUserId, username: loggedinName} = loggedinUserData
  const [messages, setMessages] = useState()
  const {data : databaseMessages} = useQuery(['messages', conversationId], () => getMessages(conversationId),{
    onSuccess: (databaseMessages) => {
      setMessages(databaseMessages)
    }
    })
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [userTyping, setUserTyping] = useState(null)
  const scrollRef = useRef()

  console.log(messages)

  useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])

 // console.log(arrivalMessage)

 
  useEffect(() => {
    socket.current && socket.current.on('getMessage', ({senderId, text}) => {
      //console.log({senderId, text})
      setArrivalMessage({
        id: messages.length + 1, 
        senderId,
        text,
        createdAt: Date.now()
      })
    })

    socket.current && socket.current.on('userTyping', ({userTyping}) => {
      console.log(userTyping)
      setUserTyping(userTyping)
    })

  }, [])

  console.log(userTyping && userTyping + " is typing...")

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    console.log("after", messages)
  }, [arrivalMessage])

  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages])


  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        message && message.map(message => ( 
          <div ref={scrollRef} key={message && message.id}>
            <Message key={message && message.id} own={message && message.senderId == loggedinUserId ? true : false}
          text={message && message.text} 
          timeSent={message && message.createdAt} />
          </div>
        )
         )}
      </div>
      <div className={styles.chatBottom}>
        <SendMessage conversationId={conversationId} senderId={loggedinUserId} senderName={loggedinName} receiverId={receiverId} socket={socket}/>
      </div>
    </div>
  )
}

export default ChatSection