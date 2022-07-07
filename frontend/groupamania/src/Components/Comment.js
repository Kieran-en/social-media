import React from "react";
import navStyle from '../Styles/timeline.module.css'
import navImg from '../Images/icon-above-font.png';

const Comment = ({text, username, profileImg}) => {

    return (
        <div className={navStyle.commentSection}> 
        <div >
        <img src={profileImg} className={navStyle.profileImg}/>
    </div>
    <div className="p-1 d-flex flex-column align-items-start" style={{backgroundColor: '#3A3B3C', borderRadius: '10px', marginLeft: '10px'}}><p style={{marginLeft: '10px', fontWeight: 'bold'}}>{username}</p> <p>{text} </p></div>
    </div>
    )
}

export default (Comment);