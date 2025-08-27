import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getMessages } from '../Services/messageService';
import Message from './Message';
import SendMessage from './sendMessage'; 
import typingAnimation from '../animations/typing.json';
import { MessageCircle } from 'lucide-react';

function ChatSection({ loggedinUserData, socket }) {
    const conversation = useSelector((state) => state.conversation);
    
    // --- ADD THIS ONE LINE RIGHT HERE ---
    // console.log('[ChatSection] Received conversation state from Redux:', conversation);
    // ------------------------------------

    const { id: conversationId, receiver } = conversation;

    const { userId: loggedinUserId, username: loggedinName } = loggedinUserData;
    const [messages, setMessages] = useState([]);
    
    const [typing, setTyping] = useState(false);

    useQuery(['messages', conversationId], () => getMessages(conversationId), {
        enabled: !!conversationId,
        onSuccess: (databaseMessages) => { 
            setMessages(databaseMessages);
        },
    });

    const [isTyping, setIsTyping] = useState(false); 
    const scrollRef = useRef();

    useEffect(() => {
        if (!socket.current) return;
        
        const messageHandler = ({ senderId, text, room }) => {
            if (room === conversationId) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: Date.now(),
                        senderId,
                        text,
                        ConversationId: room,
                        createdAt: Date.now(),
                    },
                ]);
            }
        };

        const typingHandler = () => setIsTyping(true);
        const stopTypingHandler = () => setIsTyping(false);
        
        socket.current.on('getMessage', messageHandler);
        socket.current.on('typing', typingHandler);
        socket.current.on('stop typing', stopTypingHandler);

        return () => {
            socket.current.off('getMessage', messageHandler);
            socket.current.off('typing', typingHandler);
            socket.current.off('stop typing', stopTypingHandler);
        };
    }, [socket, conversationId]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

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
                        {messages && messages.map((message) => {
                            const isOwnMessage = message.senderId === loggedinUserId;
                            const senderData = isOwnMessage ? loggedinUserData : receiver;

                            return (
                                <div ref={scrollRef} key={message.id}>
                                    <Message
                                        own={isOwnMessage}
                                        text={message.text}
                                        timeSent={message.createdAt}
                                        sender={senderData}
                                    />
                                </div>
                            );
                        })}
                        {isTyping && (
                            <div ref={scrollRef} className="flex items-center">
                                <Lottie
                                    animationData={typingAnimation}
                                    style={{ height: '4rem', width: '4rem' }}
                                    loop={true}
                                />
                                <span className="text-gray-500 text-sm ml-2">{receiver?.username} is typing...</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {conversationId && (
                <div className="border-t bg-gray-50 p-4">
                    <SendMessage
                        conversationId={conversationId}
                        senderId={loggedinUserId}
                        senderName={loggedinName}
                        receiverId={receiver?.userId}
                        socket={socket}
                        typing={typing}
                        setTyping={setTyping}
                    />
                </div>
            )}
        </div>
    );
}

export default ChatSection;