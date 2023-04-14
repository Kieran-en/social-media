import React from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/message.module.css'
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

export default function Message({ own, text, timeSent }) {
    const user = getCurrentUser()
    const ownStyleAllocation = own ? styles.own : ''

  return (
    <div className={`${styles.message_box} ${ownStyleAllocation}`}>
        <div className={`${styles.message} ${ownStyleAllocation}`}>
            <img src={user.profileImg} className={styles.image} alt="message-sender-profile" />
            <p className={`${styles.text} ${ownStyleAllocation}`}>{text}</p>
        </div>
        <span className={`${styles.time} ${ownStyleAllocation}`}>{dayjs(timeSent).fromNow()}</span>
    </div>
  )
}
