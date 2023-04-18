import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import { createConversation } from '../Services/conversationService'
import { getCurrentUser } from '../Services/userService'
import { setConversation } from '../features/conversations/conversationSlice'
import styles from '../Styles/conversation.module.css'

function Conversation({receiverId, name, profileImg}) {
    const token = useSelector(state => state.token)
    const currentUser = getCurrentUser(token)
    const queryClient = useQueryClient()
    const {userId: senderId} = currentUser;
    const dispatch = useDispatch()
    const conversation = useSelector((state) => state.conversation)

    const conversationMutation = useMutation(createConversation, {
      onSuccess: (data) => {
        console.log(data)
        dispatch(setConversation(data))
        //queryClient.invalidateQueries('conversation')
        //setCurrentChat(data)
        //queryClient.setQueryData('conversation', data)
      }
    })

   console.log(conversation)

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