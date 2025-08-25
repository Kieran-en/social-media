import React, { useState, useRef, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query';
import { IoSendSharp } from "react-icons/io5";
import { Paperclip, Smile } from "lucide-react";
import { createMessage } from '../Services/messageService';
import { useSelector } from 'react-redux';

function SendMessage({conversationId, senderId, receiverId, senderName, socket, typing, setTyping}) {
    const conversation = useSelector(state => state.conversation)
    const [text, setText] = useState("");
    const queryClient = useQueryClient()
    const textareaRef = useRef(null);

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
        if (!text.trim()) return;

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

    // Auto-resize effect
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [text]);

    return (
        <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
                <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
                <Smile className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center w-full ">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                    className="flex-1 text-sm"
                    placeholder="Type a message..."
                    rows="1"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className={`ml-2 p-2 rounded-full transition-all duration-200 ${
                        text.trim()
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg transform hover:scale-110'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <IoSendSharp className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default SendMessage;