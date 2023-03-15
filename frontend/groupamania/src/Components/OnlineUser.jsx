import React from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/onlineUser.module.css'

function OnlineUser() {
    const user = getCurrentUser()
  return (
    <div className={styles.online_user}>
    <div style={{position: 'relative'}}>
    <img src={user.profileImg} alt="conversation-image" className={styles.image}>
    </img>
    <div className={styles.online_dot}></div>
    </div>
    <span className={styles.name}>{user.username}</span>
    </div>
  )
}

export default OnlineUser