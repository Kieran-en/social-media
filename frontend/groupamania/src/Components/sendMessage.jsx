import React, { useState } from 'react'
import { useQueryClient, useMutation } from 'react-query';
import { IoSendSharp } from "react-icons/io5";
import { createMessage } from '../Services/messageService';
import styles from '../Styles/sendMessage.module.css'
import { useSelector } from 'react-redux';

function SendMessage({conversationId, senderId, receiverId, senderName, socket}) {
    const conversation = useSelector(state => state.conversation)
    const [text, setText] = useState();
    const queryClient = useQueryClient()

    const createMessageMutation = useMutation(createMessage, {
      onSuccess: () => {
        queryClient.invalidateQueries('messages')
      }
    })

    const handleChange = (event) => {
      socket.current && socket.current.emit('typing', {senderName, room: conversation.id})

        setText(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        createMessageMutation.mutate({
          text: text,
          conversationId: conversationId,
          senderId: senderId
        })

        socket.current && socket.current.emit('sendMessage', {
          senderId,
          text,
          receiverId,
          room: conversationId
        }) 

        setText("")
    }

  return (
    <div className={styles.box}>
        <textarea type="text" value={text} onChange={handleChange} className={styles.input} placeholder="Send Message...">
        </textarea>
        <IoSendSharp className={styles.icon} onClick={handleSubmit}/>
    </div>
  )
}

export default SendMessage