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
    <div className={navStyle.commentContent}>
                <div className={navStyle.commentBubble}>
                    <p className={navStyle.commentUsername}>{username}</p> 
                    <p className={navStyle.commentText}>{text}</p>
                </div>
                <span className={navStyle.commentTimestamp}>
                    {dayjs(date).fromNow()}
                </span>
            </div>
    {/* <span style={{fontSize: '10px', marginLeft: '5px', color: '#A8ABAF'}}>{dayjs(date).fromNow()}</span> */}
    </div>
    )
}

export default Comment;