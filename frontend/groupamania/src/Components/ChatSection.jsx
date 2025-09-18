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
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Header de la conversation */}
            {conversationId && receiver && (
                <div className="flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <img
                        src={receiver.profileImg || `https://ui-avatars.com/api/?name=${receiver.username}&background=random`}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        alt={`${receiver.username}'s profile`}
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800">{receiver.username}</h3>
                        <p className="text-sm text-gray-500">En ligne</p>
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {Object.keys(conversation).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium text-lg">Aucune conversation ouverte</p>
                        <p className="text-gray-400 text-sm">Sélectionnez un chat pour commencer à discuter !</p>
                    </div>
                ) : (
                    <>
                        {messages && messages.map((message, index) => {
                            const isOwnMessage = message.senderId === loggedinUserId;
                            const senderData = isOwnMessage ? loggedinUserData : receiver;
                            const isLastMessage = index === messages.length - 1;

                            return (
                                <div key={message.id} ref={isLastMessage ? scrollRef : null}>
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
                <div className="border-t border-gray-200 bg-white p-3">
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