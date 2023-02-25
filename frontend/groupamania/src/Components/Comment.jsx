import React from 'react'
import navStyle from '../Styles/timeline.module.css';

export default function Comment({text, username, profileImg, date}) {
  return (
    <div>
      <div>
        <img alt="profileImage" src=""/> 
        <input type="text"></input>
      </div>
      <div className={navStyle.commentSection}> 
        <div >
        <img src={profileImg} className={navStyle.profileImg}/>
    </div>
    <div className="p-1 d-flex flex-column align-items-start" style={{backgroundColor: '#3A3B3C', borderRadius: '10px', marginLeft: '10px'}}>
      <p style={{paddingLeft: '10px', fontWeight: 'bold'}}>{username}</p> 
      <p style={{paddingLeft: '10px'}}>{text}</p>
      </div>
    <span style={{fontSize: '10px', marginLeft: '5px', color: '#A8ABAF'}}>{dayjs(date).fromNow()}</span>
    </div>
    </div>
  )
}
