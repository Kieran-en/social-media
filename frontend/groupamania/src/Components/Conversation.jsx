import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import { createConversation } from '../Services/conversationService'
import { getCurrentUser } from '../Services/userService'
import { setConversation } from '../features/conversations/conversationSlice'
import styles from '../Styles/conversation.module.css'

function Conversation({receiverId, name, profileImg, socket}) {
    const token = useSelector(state => state.token)
    const currentUser = getCurrentUser(token)
    const queryClient = useQueryClient()
    const {userId: senderId} = currentUser;
    const dispatch = useDispatch()
    const conversation = useSelector((state) => state.conversation)

    const conversationMutation = useMutation(createConversation, {
      onSuccess: (data) => {
        dispatch(setConversation(data))
        socket.current.emit('join_room', {
          room: data.id,
          senderId
        })
       // queryClient.invalidateQueries(['messages', conversation.id])
        //setCurrentChat(data)
        //queryClient.setQueryData('conversation', data)
      }
    })

   //console.log(conversation)

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