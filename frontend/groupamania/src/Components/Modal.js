import React from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import http from '../services/httpService';
import Backdrop from './Backdrop';
import '../Styles/Modal.css'
import { useState } from 'react';
import style from '../Styles/timeline.module.css';
import { FaImages } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import config from '../config.json'

export default function Modal({closeModal, postToModify, allPosts}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const {userlogged} = useParams();

  const handleChange = (event) => {
    setText(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
        const post = new FormData();
        post.append('text', text)
        post.append('image', selectedFile);
        post.append('postId', postToModify);

    if (validate(post)){
     http.put(`${config.apiEndpoint}/post`, post)
     .then(res => {
       console.log(res)
       allPosts()
     })
     .catch(error => console.log(error))
     console.log(postToModify)
    }
  }

  function validate(text){
    if (text.length < 1){
      setError('Post should be atleat 1 caracter')
      return false;
    }
    return true;
  }

  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

  return (
    <Backdrop closeModal={closeModal}>
   <div className='modalll' onClick={(e) => e.stopPropagation()}>
       <div className='topModalll'><span>Hey, {userlogged}!</span>
       <span>
         < IoCloseCircleOutline  style={{cursor: 'pointer'}} onClick={() => {closeModal()}}/>
         </span>
         </div>
       <textarea placeholder="You've changed your mind?" value={text} style={{height: '200px'}} onChange={handleChange} ></textarea>
       <div style={{display: 'flex', alignItems: 'flex-start', width: '90%'}}>
       <label htmlFor='uplaod-modify' className={style.multimediaLabel}>Media  <FaImages /></label>
       <input id='uplaod-modify' name='image' type='file' className={style.multimediaInput} onChange={changeHandler}></input>
       </div>
       {error && (
                    <p className="text-warning">{error}</p>
                  )}
       <button type='submit' className='button' onClick={handleSubmit} >Publish</button>
   </div>
   </Backdrop>
   
  )
}
