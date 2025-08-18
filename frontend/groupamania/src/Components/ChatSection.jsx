import React, {useEffect, useRef, useState} from 'react'
import Lottie from 'lottie-react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { getMessages } from '../Services/messageService'
import Message from './Message'
import SendMessage from './sendMessage'
import typingAnimation from '../animations/typing.json'
import { MessageCircle } from 'lucide-react'

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

    useEffect(() => {
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
    })

    useEffect(() => {
        socket.current && socket.current.on('typing', ({userTyping}) => {
            setUserTyping(userTyping)
        })
    })

    useEffect(() => {
        socket.current && socket.current.on('typing', () => {
            setIsTyping(true)
        })
        socket.current && socket.current.on('stop typing', () => {
            setIsTyping(false)
        })
    })

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior : 'smooth'})
    }, [messages, isTyping])

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.keys(conversation).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No opened conversation</p>
                        <p className="text-gray-400 text-sm">Select a chat to start messaging!</p>
                    </div>
                ) : (
                    <>
                        {messages && messages.map(message => (
                            <div ref={scrollRef} key={message && message.id}>
                                <Message
                                    own={message && message.senderId === loggedinUserId ? true : false}
                                    text={message && message.text}
                                    timeSent={message && message.createdAt}
                                />
                            </div>
                        ))}
                        {isTyping && (
                            <div ref={scrollRef} className="flex items-center">
                                <Lottie
                                    animationData={typingAnimation}
                                    style={{height: '4rem', width: '4rem'}}
                                />
                                <span className="text-gray-500 text-sm ml-2">{userTyping} is typing...</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="border-t bg-gray-50 p-4">
                <SendMessage
                    conversationId={conversationId}
                    senderId={loggedinUserId}
                    senderName={loggedinName}
                    receiverId={receiverId}
                    socket={socket}
                    typing={typing}
                    setTyping={setTyping}
                />
            </div>
        </div>
    )
}

export default ChatSection