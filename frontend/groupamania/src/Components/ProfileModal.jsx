import React from 'react'
import Backdrop from './Backdrop';
import { IoCloseCircleOutline } from "react-icons/io5";
import '../Styles/ProfileModal.css';
import style from '../Styles/profile.module.css';
import { useState, useContext } from 'react';
import {Tooltip,} from 'react-tippy';
import { useMutation, useQueryClient } from "react-query";
import { modifyUser } from '../Services/userService';
import { AuthContext } from '../Context/AuthContext';

function ProfileModal({closeModal, username, email, profileImg}) {
    const queryClient = useQueryClient()
    const [values, setValues] = useState({
        name: username,
        email: email,
    });
    const [file, setFile] = useState();
    const [formErrors, setFormErrors] = useState({});
    const userData = useContext(AuthContext)
    const userId = userData.userId
    console.log(file)


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

    const updateUserMutation = useMutation(modifyUser, {
            onSuccess: () => {
                queryClient.invalidateQueries(['user', userId])
              }
    })

    const handleSubmit = (event) => {
        event.preventDefault()
        const userInfo = new FormData();
        userInfo.append('name', values.name);
        userInfo.append('email', values.email);
        userInfo.append('image', file);
        userInfo.append('id', userId)

        if (validateForm()){
            updateUserMutation.mutate(userInfo)
            closeModal()
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

             <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
            <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top"><img src={profileImg} alt="profile-image" className={style.profileImg}></img></Tooltip>
            <label htmlFor='uplaod-profile' className='uplaod-profileLabel'>Modify profile Image</label>
             <input id='uplaod-profile' name='image' type='file' className='uplaod-profileInput' onChange={handleFileChange}></input>
            </div>
             {file && 
             <img src={URL.createObjectURL(file)} alt="profileImage-preview" 
             style={{width: '80px', 
             height: '80px', 
             objectFit: 'cover', 
             borderRadius: '50%',
             alignSelf: 'flex-end'}}/>}
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
       <button type='submit' style={{border: 'none', width: '90%', padding: '3px', borderRadius: '10px', backgroundColor: '#0F6E5A', color: 'white'}} onClick={handleSubmit}>Update</button>
       </div>
       </Backdrop>
  )
}

export default ProfileModal;