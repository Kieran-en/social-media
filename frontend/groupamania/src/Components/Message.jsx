import React from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/message.module.css'

export default function Message() {
    const user = getCurrentUser()

  return (
    <div className={styles.message_box}>
        <div className={styles.message}>
            <img src={user.profileImg} className={styles.image} alt="message-sender-profile" />
            <p className={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Incidunt quam adipisci asperiores corrupti expedita. Non autem tempore natus ut,
                id deserunt consequuntur necessitatibus,
                voluptatibus cumque consectetur praesentium eligendi repellendus atque.</p>
        </div>
        <span className={styles.time}>1 hour</span>
    </div>
  )
}
