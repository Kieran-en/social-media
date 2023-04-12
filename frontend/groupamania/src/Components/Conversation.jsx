import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createConversation } from '../Services/conversationService'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/conversation.module.css'

function Conversation({receiverId, name, profileImg}) {
    const currentUser = getCurrentUser()
    const queryClient = useQueryClient()
    const {userId: senderId} = currentUser;

    const conversationMutation = useMutation(createConversation, {
      onSuccess: (data) => {
        //queryClient.invalidateQueries('conversation')
        //setCurrentChat(data)
        queryClient.setQueryData('conversation', data)
      }
    })

    const addConversation = () => {
      conversationMutation.mutate({
        receiverId: receiverId,
        senderId: senderId
      })
    }

  return (
    <div className={styles.conversation} onClick={addConversation}>
        <img src={profileImg} alt="conversation-image" className={styles.image}></img>
        <span className={styles.name}>{name}</span>
    </div>
  )
}

export default Conversation