import React from 'react'
import Backdrop from './Backdrop';
import { IoCloseCircleOutline } from "react-icons/io5";
import '../Styles/ProfileModal.css';
import style from '../Styles/profile.module.css';
import { useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import {Tooltip,} from 'react-tippy';

function ProfileModal({closeModal, username, email, updateUser, profileImg, getUserData}) {
    const [values, setValues] = useState({
        name: username,
        email: email,
    });
    const [file, setFile] = useState();
    const [formErrors, setFormErrors] = useState({});
    console.log(file)

    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const handleChange = (event) => {
        setValues(values => ({
            ...values,
            [event.target.name] : event.target.value,
        }));
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    }

    const validateForm = () => {
        const errors = {};

        if (values.name.length < 4){
            errors.name = 'Name should be atleast 4 caracters long';
        }
        if (!values.email){
            errors.email = 'Please insert an email'
        } else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Invalid email';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0){
            return true;
        } else {
            return false;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const userData = new FormData();
        userData.append('name', values.name);
        userData.append('email', values.email);
        userData.append('image', file);
        if (validateForm()){
          axios.put(`http://localhost:3000/api/auth/${JSON.parse(localStorage.getItem('userData')).userId}`, userData)
    .then((response) => {
        console.log(response)
        closeModal()
        updateUser(values)
        getUserData()
    })
    .catch(error => console.log(error))
        }
    }


  return (
     <Backdrop closeModal={closeModal}>
       <div className='modall' onClick={(e) => e.stopPropagation()}>
       <div className='topModalll'><span>Hey, {username}!</span>
       <span>
         < IoCloseCircleOutline  style={{cursor: 'pointer'}} onClick={closeModal}/>
         </span>
         </div>
         <div style={{display: 'flex', width: '90%', justifyContent: 'flex-start', marginBottom: '10px', alignItems: 'center'}}>
             <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top"><img src={profileImg} alt="profile-image" className={style.profileImg}></img></Tooltip>
             <div style={{display: 'flex', justifyContent: 'flex-start'}}>
             <label htmlFor='uplaod-profile' className='uplaod-profileLabel'>Modify profile Image</label>
             <input id='uplaod-profile' name='image' type='file' className='uplaod-profileInput' onChange={handleFileChange}></input>
             </div>
             </div>
         <div className='textAreas'>
         <textarea name='name' placeholder="New Name" value={values.name} onChange={handleChange}></textarea>
         {formErrors.name && (
                    <p style={{fontSize: '14px'}} className="text-warning">{formErrors.name}</p>
                  )}
         <textarea name='email' placeholder="New Email" value={values.email}  onChange={handleChange}></textarea>
         {formErrors.email && (
                    <p style={{fontSize: '12px'}} className="text-warning">{formErrors.email}</p>
                  )}
        </div>
       <button type='submit' style={{border: 'none', width: '90%', padding: '3px', borderRadius: '10px', backgroundColor: '#DC3545', color: 'white'}} onClick={handleSubmit}>Update</button>
       </div>
       </Backdrop>
  )
}

export default ProfileModal;