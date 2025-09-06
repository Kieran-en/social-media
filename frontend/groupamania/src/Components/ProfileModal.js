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
        email: email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    // --- FIN DU FIX ---

    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleTogglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        // Réinitialiser les champs de mot de passe quand on ferme
        if (showPasswordForm) {
            setValues(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            // Effacer les erreurs de mot de passe
            setFormErrors(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        }
    };


    // Fonction de validation du formulaire (maintenant sécurisée)
    const validateForm = () => {
        const errors = {};
        // Validation du nom seulement s'il a été modifié et n'est pas vide
        if (values.name.trim() !== username && values.name.trim().length > 0 && values.name.trim().length < 4) {
            errors.name = 'Username must be at least 4 characters long.';
        }
        // Empêcher l'envoi d'un nom vide si l'utilisateur a commencé à le modifier
        if (values.name.trim() !== username && values.name.trim().length === 0) {
            errors.name = 'Username cannot be empty.';
        }
        // Même logique pour l'email
        if (!values.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Please enter a valid email address.';
        }
        
        // Validation du mot de passe si le formulaire est affiché et des champs sont remplis
        if (showPasswordForm && (values.newPassword || values.confirmPassword || values.currentPassword)) {
            if (!values.currentPassword) {
                errors.currentPassword = 'Current password is required to change password.';
            }
            if (!values.newPassword) {
                errors.newPassword = 'New password is required.';
            } else if (values.newPassword.length < 6) {
                errors.newPassword = 'New password must be at least 6 characters long.';
            }
            if (values.newPassword !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match.';
            }
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
            // Ne modifier le nom que s'il a été changé ET n'est pas vide
            if (values.name.trim() !== username && values.name.trim().length > 0) {
                userInfo.append('name', values.name);
            }
            userInfo.append('email', values.email);
            if (file) {
              userInfo.append('image', file);
            }
            if (showPasswordForm && values.newPassword) {
              userInfo.append('newPassword', values.newPassword);
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
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto m-4 sm:m-6' onClick={(e) => e.stopPropagation()}>
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
                    
                    {/* Bouton pour afficher/masquer le formulaire de mot de passe */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleTogglePasswordForm}
                            className="text-xs text-gray-400 hover:text-gray-600 underline hover:no-underline transition-all duration-200"
                        >
                            {showPasswordForm ? 'Masquer le mot de passe' : 'Modifier le mot de passe'}
                        </button>
                    </div>
                    
                    {/* Section pour changer le mot de passe */}
                    {showPasswordForm && (
                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 text-center">Change Password</h3>
                        
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    autoComplete="new-password"
                                />
                                {formErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{formErrors.currentPassword}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />
                                {formErrors.newPassword && <p className="text-red-500 text-xs mt-1">{formErrors.newPassword}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />
                                {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                            </div>
                        </div>
                    )}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateUserMutation.isLoading}
                            className="w-full bg-green-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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