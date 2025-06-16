import React, {useEffect, useRef, useState} from 'react'
import Lottie from 'lottie-react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './sendMessage'
import typingAnimation from '../animations/typing.json'

function ChatSection({loggedinUserData, socket}) {

  const conversation = useSelector((state) => state.conversation)
  const { id: conversationId, receiverId, senderId } = conversation
  const {userId: loggedinUserId, username: loggedinName} = loggedinUserData
  const [messages, setMessages] = useState([])
  const {data : databaseMessages} = useQuery(['messages', conversationId], () => getMessages(conversationId),{
    onSuccess: (databaseMessages) => {
      setMessages(databaseMessages)
    }
    })
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [userTyping, setUserTyping] = useState(null)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef()
  //Styling lottie
  const style = {
    height: 200,
    width: 200,
  }

/** 
 * useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])
*/

//console.log('outside', messages)

 
  useEffect(() => {

    //let isMounted = true;

   // if(isMounted){
      socket.current && socket.current.on('getMessage', ({senderId, text, room}) => {
        console.log('received', {senderId, text, room})

      setMessages([...messages, {
          id: messages.length + 2, 
          senderId,
          text,
          ConversationId: room,
          createdAt: Date.now()
        }]) 
  
      })
  
  //  }

  /**return () => {
      isMounted = false;
  } */
     

  })

  //console.log(userTyping && userTyping + " is typing...")

  useEffect(() => {
    socket.current && socket.current.on('typing', ({userTyping}) => {
      setUserTyping(userTyping)
    })
  })

  useEffect(() => {
    socket.current && socket.current.on('typing', () => {
      //console.log('typing oh')
       setIsTyping(true)
      })
    socket.current && socket.current.on('stop typing', () => {
     // console.log('stop typing oh')
      setIsTyping(false)
    })
  })
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages, isTyping])
  

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        messages && messages.map(message => ( 
          <div ref={scrollRef} key={message && message.id}>
          <Message own={message && message.senderId === loggedinUserId ? true : false}
          text={message && message.text} 
          timeSent={message && message.createdAt} />
          </div>
        )
         )}
         {isTyping && 
         (<div ref={scrollRef}>
          <Lottie animationData={typingAnimation} 
         style={{height: '4.2rem', width: '4.2rem', marginTop: '0.1rem', marginLeft: 0}}/>
         </div>)
       }
      </div>
      <div className={styles.chatBottom}>
        <SendMessage conversationId={conversationId} 
        senderId={loggedinUserId} 
        senderName={loggedinName} 
        receiverId={receiverId} 
        socket={socket}
        typing={typing}
        setTyping={setTyping}/>
      </div>
    </div>
  )
}

export default ChatSection