import React from 'react'
import OnlineUser from './OnlineUser'
import styles from '../Styles/online.module.css'
function OnlineSection({onlineUsers}) {
  return (
    <div>
      {onlineUsers.length > 0 ? 
      onlineUsers.map(user => <OnlineUser key={user.userId} OnlineUser username={user.username} profileImg={user.profileImg} />) : 
      <p className={styles.paragraph}>None of your friends is currently online</p>}
    </div>
  )
}

export default OnlineSection