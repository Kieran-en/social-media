import React, {useEffect, useRef, useState} from 'react'
import Lottie from 'lottie-react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import styles from '../Styles/chat.module.css'
import SendMessage from './SendMessage'
import animationData from '../animations/typing.json'

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

  console.log('is typing', isTyping)



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

/** 
 * useEffect(() => {
    getMessages(conversationId)
  }, [conversation.id])
*/

console.log('outside', messages)

 
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

      /** 
       *socket.current && socket.current.on('userTyping', ({userTyping}) => {
        setUserTyping(userTyping)
      })
      */
  
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
      console.log('typing oh')
       setIsTyping(true)
      })
    socket.current && socket.current.on('stop typing', () => {
      console.log('stop typing oh')
      setIsTyping(false)
    })
  }, [])

  console.log(userTyping + "typing...")



  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : 'smooth'})
  }, [messages])
  
  //console.log(userTyping)

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        { Object.keys(conversation).length === 0 ? 
        <p className={styles.paragraph}>No opened conversation, open a chat!</p> : 
        messages && messages.map(message => ( 
          <div ref={scrollRef} key={message && message.id}>
          <Message own={message && message.senderId == loggedinUserId ? true : false}
          text={message && message.text} 
          timeSent={message && message.createdAt} />
          </div>
        )
         )}
         {isTyping && <span style={{color: 'white'}}>Typing</span>
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