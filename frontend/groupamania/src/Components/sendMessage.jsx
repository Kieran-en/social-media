import React, { useState, useRef, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query';
import { IoSendSharp } from "react-icons/io5";
import { createMessage } from '../Services/messageService';
import styles from '../Styles/sendMessage.module.css'
import { useSelector } from 'react-redux';

function SendMessage({conversationId, senderId, receiverId, senderName, socket, typing, setTyping}) {
    const conversation = useSelector(state => state.conversation)
    const [text, setText] = useState("");
    const queryClient = useQueryClient()
    const textareaRef = useRef(null); // ✅ Ref for auto-resizing

    const createMessageMutation = useMutation(createMessage, {});

    const handleChange = (event) => {
        socket.current && socket.current.emit('typing', { senderName, room: conversationId });

        if (!typing) {
            setTyping(true);
            socket.current && socket.current.emit('typing', { senderName, room: conversationId });
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.current && socket.current.emit('stop typing', { senderName, room: conversationId });
                setTyping(false);
            }
        }, timerLength);

        setText(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        socket.current && socket.current.emit('stop typing', { senderName, room: conversationId });

        createMessageMutation.mutate({
            text: text,
            conversationId: conversationId,
            senderId: senderId
        });

        socket.current && socket.current.emit('sendMessage', {
            senderId,
            text,
            receiverId,
            room: conversationId
        });

        setText("");
    };

    // ✅ Auto-resize effect
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // max-height limit
        }
    }, [text]);

    return (
        <div className={styles.box}>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                className={styles.input}
                placeholder="Send Message..."
            />
            <IoSendSharp className={styles.icon} onClick={handleSubmit} />
        </div>
    );
}

export default SendMessage;
