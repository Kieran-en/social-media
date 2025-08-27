// src/Components/ProfileModal.jsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { modifyUser } from '../Services/userService';
import Backdrop from './Backdrop';
import { X, Camera } from 'lucide-react'; 

function ProfileModal({ closeModal, username, email, profileImg, userId }) {
    const queryClient = useQueryClient();
    
    // --- FIX: Fournir une valeur de secours (fallback) à une chaîne vide '' ---
    // Si 'username' ou 'email' est undefined, on utilise '' à la place.
    const [values, setValues] = useState({ 
        name: username || '', 
        email: email || '' 
    });
    // --- FIN DU FIX ---

    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    // Fonction de validation du formulaire (maintenant sécurisée)
    const validateForm = () => {
        const errors = {};
        // values.name sera '' au lieu de undefined, donc .trim() ne crashera pas.
        if (values.name.trim().length < 4) {
            errors.name = 'Username must be at least 4 characters long.';
        }
        // Même logique pour l'email
        if (!values.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Please enter a valid email address.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const updateUserMutation = useMutation(modifyUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(['user', values.name]); // Utiliser le nouveau nom pour l'invalidation
            closeModal();
        },
        onError: (error) => {
            alert("An error occurred while updating the profile. Please try again.");
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
            if (file) {
              userInfo.append('image', file);
            }
            userInfo.append('id', userId);

            updateUserMutation.mutate(userInfo);
        }
    };

    const imagePreviewUrl = file 
      ? URL.createObjectURL(file) 
      : profileImg || `https://ui-avatars.com/api/?name=${username || ''}`;

    return (
        <Backdrop closeModal={closeModal}>
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-lg font-semibold text-gray-800'>Edit Profile</h2>
                    <button onClick={closeModal} className='text-gray-400 hover:text-gray-600'>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    <div className='flex flex-col items-center'>
                        <label htmlFor="profile-upload" className="cursor-pointer group relative">
                            <img src={imagePreviewUrl} alt="profile-preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={28} className="text-white" />
                            </div>
                        </label>
                        <input id="profile-upload" name="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={values.name}
                            onChange={handleChange}
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={values.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateUserMutation.isLoading}
                            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {updateUserMutation.isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Backdrop>
    );
}

export default ProfileModal;