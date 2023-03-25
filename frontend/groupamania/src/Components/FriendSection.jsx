import React, { useState } from 'react'
import { getCurrentUser } from '../Services/userService'
import styles from '../Styles/friend.module.css'
import Conversation from './Conversation'

function FriendSection() {
    const [search, setSearch] = useState()
    const userData = getCurrentUser();

    const onChange = (event) => {
        setSearch(event.target.value)
    }

  return (
    <div>
        <input value={search} onChange={onChange} className={styles.input} placeholder="Search  for friends..."/>
        <div className={styles.conversation_part}>
        <Conversation />
        <Conversation />
        </div>
    </div>
  )
}

export default FriendSection