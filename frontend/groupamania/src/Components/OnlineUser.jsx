import React from 'react'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/onlineUser.module.css'

function OnlineUser({username, profileImg}) {
  const token = useSelector(state => state.token)
  const user = getCurrentUser(token)

  return (
    <div className={styles.online_user}>
    <div style={{position: 'relative'}}>
    <img src={profileImg} alt="conversation-image" className={styles.image}>
    </img>
    <div className={styles.online_dot}></div>
    </div>
    <span className={styles.name}>{username}</span>
    </div>
  )
}

export default OnlineUser