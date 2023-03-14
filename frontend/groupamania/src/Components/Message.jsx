import React from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/message.module.css'

export default function Message({ own }) {
    const user = getCurrentUser()
    const ownStyleAllocation = own ? styles.own : ''

  return (
    <div className={`${styles.message_box} ${ownStyleAllocation}`}>
        <div className={`${styles.message} ${ownStyleAllocation}`}>
            <img src={user.profileImg} className={styles.image} alt="message-sender-profile" />
            <p className={`${styles.text} ${ownStyleAllocation}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Incidunt quam adipisci asperiores corrupti expedita. Non autem tempore natus ut,
                id deserunt consequuntur necessitatibus,
                voluptatibus cumque consectetur praesentium eligendi repellendus atque.</p>
        </div>
        <span className={`${styles.time} ${ownStyleAllocation}`}>1 hour ago</span>
    </div>
  )
}
