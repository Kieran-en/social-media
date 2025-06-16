import React, { useState, useEffect } from 'react';
import Backdrop from './Backdrop';
import { IoCloseCircleOutline } from "react-icons/io5";
import '../Styles/ProfileModal.css';
import style from '../Styles/profile.module.css';
import { Tooltip } from 'react-tippy';
import { useMutation, useQueryClient } from "react-query";
import { getCurrentUser, modifyUser } from '../Services/userService';
import { useSelector } from 'react-redux';

function ProfileModal({ closeModal, username, email, profileImg }) {
    const queryClient = useQueryClient();
    const [values, setValues] = useState({
        name: username,
        email: email,
    });
    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const token = useSelector(state => state.token);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser(token);
                setUserId(userData.userId);
            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };
        fetchUser();
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const validateForm = () => {
        const errors = {};
        if (values.name.trim().length < 4) {
            errors.name = 'Name should be at least 4 characters long';
        }
        if (!values.email) {
            errors.email = 'Please insert an email';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Invalid email format';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const updateUserMutation = useMutation(modifyUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['user', userId]);
        },
        onError: (error) => {
            console.error("Error updating user:", error);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!userId) return;

        if (validateForm()) {
            const userInfo = new FormData();
            userInfo.append('name', values.name);
            userInfo.append('email', values.email);
            if (file) userInfo.append('image', file);
            userInfo.append('id', userId);

            updateUserMutation.mutate(userInfo);
            closeModal();
        }
    };

    return (
        <Backdrop closeModal={closeModal}>
            <div className='modall' onClick={(e) => e.stopPropagation()}>
                <div className='topModalll'>
                    <span>Hey, {username}!</span>
                    <span>
                        <IoCloseCircleOutline style={{ cursor: 'pointer' }} onClick={closeModal} />
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    width: '90%',
                    justifyContent: 'flex-start',
                    marginBottom: '10px',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip trigger="mouseenter" title="Change Profile Image" arrow="true" position="top">
                                <img src={file ? URL.createObjectURL(file) : profileImg} alt="profile-image" className={style.profileImg} />
                            </Tooltip>
                            <label htmlFor='upload-profile' className='uplaod-profileLabel'>Modify profile Image</label>
                            <input id='upload-profile' name='image' type='file' className='uplaod-profileInput' onChange={handleFileChange} />
                        </div>
                        {file &&
                            <img src={URL.createObjectURL(file)} alt="preview"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    alignSelf: 'flex-end'
                                }} />}
                    </div>
                </div>

                <div className='textAreas'>
                    <textarea
                        name='name'
                        placeholder="New Name"
                        value={values.name}
                        onChange={handleChange}
                    />
                    {formErrors.name && (
                        <p style={{ fontSize: '14px' }} className="text-warning">{formErrors.name}</p>
                    )}
                    <textarea
                        name='email'
                        placeholder="New Email"
                        value={values.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && (
                        <p style={{ fontSize: '12px' }} className="text-warning">{formErrors.email}</p>
                    )}
                </div>

                <button
                    type='submit'
                    style={{
                        border: 'none',
                        width: '90%',
                        padding: '3px',
                        borderRadius: '10px',
                        backgroundColor: '#0F6E5A',
                        color: 'white'
                    }}
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </div>
        </Backdrop>
    );
}

export default ProfileModal;
