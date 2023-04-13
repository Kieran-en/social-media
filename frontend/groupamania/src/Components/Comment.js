import React from "react";
import navStyle from '../Styles/timeline.module.css';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const Comment = ({text, username, profileImg, date}) => {

    return (
        <div className={navStyle.commentSection}> 
        <div >
        <img src={profileImg} className={navStyle.profileImg} alt='profile-image'/>
    </div>
    <div className="p-1 d-flex flex-column align-items-start" style={{backgroundColor: '#3A3B3C', borderRadius: '10px', marginLeft: '10px'}}><p style={{marginLeft: '10px', fontWeight: 'bold'}}>{username}</p> <p>{text} </p></div>
    <span style={{fontSize: '10px', marginLeft: '5px', color: '#A8ABAF'}}>{dayjs(date).fromNow()}</span>
    </div>
    )
}

export default Comment;