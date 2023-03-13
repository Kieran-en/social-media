import React from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/conversation.module.css'

function Conversation() {
    const user = getCurrentUser()
    console.log(user)

  return (
    <div className={styles.conversation}>
        <img src={user.profileImg} alt="conversation-image" className={styles.image}></img>
        <span className={styles.name}>{user.username}</span>
    </div>
  )
}

export default Conversation