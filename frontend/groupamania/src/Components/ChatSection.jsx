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
  const {data : messages} = useQuery('messages', () => getMessages(conversationId),{
  onSuccess: () => {
    setMessage(messages)
  }
  })
  const [message, setMessage] = useState()
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [userTyping, setUserTyping] = useState(null)
  const scrollRef = useRef()

  console.log(message)

  useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])

 // console.log(arrivalMessage)

 
  useEffect(() => {
    socket.current && socket.current.on('getMessage', ({senderId, text}) => {
      console.log({senderId, text})
      setArrivalMessage({
        senderId,
        text,
        createdAt: Date.now()
      })
    })
    console.log("This you?", arrivalMessage)

  }, [])

  //console.log(userTyping && userTyping.userTyping + "is typing...")

  useEffect(() => {
    arrivalMessage && setMessage((prev) => [...prev, arrivalMessage])
    console.log("after", message)
  }, [arrivalMessage, message])

  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [message])


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