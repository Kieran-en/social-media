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
  const scrollRef = useRef()

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

    let isMounted = true;


    if(isMounted){
      socket.current && socket.current.on('getMessage', ({senderId, text, room}) => {
        console.log('received')

    setMessages([...messages, {
          id: messages.length + 2, 
          senderId,
          text,
          ConversationId: room,
          createdAt: Date.now()
        }])

        console.log('inside', messages)
  
      })

      /** 
       *socket.current && socket.current.on('userTyping', ({userTyping}) => {
        setUserTyping(userTyping)
      })
      */
  
    }

    return () => {
      isMounted = false;
  }
     

  })

  //console.log(userTyping && userTyping + " is typing...")

  /** 
   *  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    console.log("after", messages)
  }, [arrivalMessage])
  */


  
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
         {userTyping && 
         <Lottie
         options={defaultOptions}
         // height={50}
         width={80}
         style={{ marginBottom: 15, marginLeft: 0, backgroundColor: 'white' }}
       />
       }
      </div>
      <div className={styles.chatBottom}>
        <SendMessage conversationId={conversationId} senderId={loggedinUserId} senderName={loggedinName} receiverId={receiverId} socket={socket}/>
      </div>
    </div>
  )
}

export default ChatSection