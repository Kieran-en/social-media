import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getMessages } from '../Services/messageService';
import axios from 'axios';
import Message from './Message';
import styles from '../Styles/chat.module.css';
import SendMessage from './sendMessage';
import typingAnimation from '../animations/typing.json';

function ChatSection({ loggedinUserData, socket, isGroup = false }) {
  const conversation = useSelector((state) => state.conversation);
  const { id: conversationId, receiverId, senderId, groupId } = conversation;
  const { userId: loggedinUserId, username: loggedinName } = loggedinUserData;

  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userTyping, setUserTyping] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  const style = { height: 200, width: 200 };

  // Fetch chat history
  useEffect(() => {
    if (isGroup) {
      axios.get(`/api/groups/${groupId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setMessages(res.data));
    } else {
      getMessages(conversationId).then(res => setMessages(res));
    }
  }, [conversationId, groupId, isGroup]);

  // Real-time events
  useEffect(() => {
    if (!socket.current) return;

    if (isGroup) {
      socket.current.emit('joinGroup', { groupId, userId: loggedinUserId });

      socket.current.on('newMessage', (msg) => {
        if (msg.groupId === groupId) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    } else {
      socket.current.on('getMessage', ({ senderId, text, room }) => {
        if (room === conversationId) {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              senderId,
              text,
              ConversationId: room,
              createdAt: Date.now()
            }
          ]);
        }
      });
    }

    return () => {
      socket.current.off('newMessage');
      socket.current.off('getMessage');
    };
  }, [socket, groupId, conversationId, isGroup, loggedinUserId]);

  // Typing indicators (can be extended for group rooms too)
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on('typing', ({ userTyping }) => setUserTyping(userTyping));
    socket.current.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.current.off('typing');
      socket.current.off('stop typing');
    };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.box}>
      <div className={styles.chatTop}>
        {messages.length === 0 ? (
          <p className={styles.paragraph}>No messages yet</p>
        ) : (
          messages.map((message) => (
            <div ref={scrollRef} key={message.id}>
              <Message
                own={message.senderId === loggedinUserId}
                text={message.content || message.text}
                timeSent={message.createdAt}
              />
            </div>
          ))
        )}
        {isTyping && (
          <div ref={scrollRef}>
            <Lottie
              animationData={typingAnimation}
              style={{ height: '4.2rem', width: '4.2rem', marginTop: '0.1rem' }}
            />
          </div>
        )}
      </div>
      <div className={styles.chatBottom}>
        <SendMessage
          conversationId={isGroup ? groupId : conversationId}
          senderId={loggedinUserId}
          senderName={loggedinName}
          receiverId={receiverId}
          socket={socket}
          typing={typing}
          setTyping={setTyping}
          isGroup={isGroup}
        />
      </div>
    </div>
  );
}

export default ChatSection;
