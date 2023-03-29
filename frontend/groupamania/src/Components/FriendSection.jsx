import React, { useState } from 'react'
import styles from '../Styles/friend.module.css'
import Conversation from './Conversation'

function FriendSection({friends}) {
    const [search, setSearch] = useState()

    const onChange = (event) => {
        setSearch(event.target.value)
    }

  return (
    <div>
        <input value={search} onChange={onChange} className={styles.input} placeholder="Search  for friends..."/>
        <div className={styles.conversation_part}>
          {friends && friends.length > 0 ? 
          friends.map(friend => <Conversation key={friend && friend.id}
             receiverId={ friend && friend.id} name={ friend && friend.name} 
             profileImg={friend && friend.profileImg}/>) :
          <p className={styles.paragraph}>You have no friends, add some friends so you can chat!</p>
        }
        </div>
    </div>
  )
}

export default FriendSection