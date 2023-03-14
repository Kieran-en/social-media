import React, { useState } from 'react'
import { IoSendSharp } from "react-icons/io5";
import styles from '../Styles/sendMessage.module.css'

function sendMessage() {
    const [message, setMessage] = useState();

    const handleChange = (event) => {
        setMessage(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

  return (
    <div className={styles.box}>
        <input type="textarea" value={message} onChange={handleChange} className={styles.input}/>
        <IoSendSharp className={styles.icon}/>
    </div>
  )
}

export default sendMessage