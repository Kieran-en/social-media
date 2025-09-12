// src/Components/GroupProfileModal.jsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { updateGroup } from '../Services/groupService';
import Backdrop from './Backdrop';
import { X, Camera } from 'lucide-react'; 

function GroupProfileModal({ closeModal, groupName, groupDescription, profileImg, groupId }) {
    const queryClient = useQueryClient();
    
    // État du formulaire avec valeurs par défaut
    const [values, setValues] = useState({ 
        name: groupName || '', 
        description: groupDescription || ''
    });

    const [file, setFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Effacer l'erreur du champ modifié
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    // Fonction de validation du formulaire
    const validateForm = () => {
        const errors = {};
        
        // Validation du nom du groupe
        if (!values.name.trim()) {
            errors.name = 'Le nom du groupe est requis.';
        } else if (values.name.trim().length < 3) {
            errors.name = 'Le nom du groupe doit contenir au moins 3 caractères.';
        }
        
        // La description est optionnelle, mais si elle est fournie, elle doit avoir une longueur minimale
        if (values.description && values.description.trim().length > 0 && values.description.trim().length < 10) {
            errors.description = 'La description doit contenir au moins 10 caractères si elle est fournie.';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const updateGroupMutation = useMutation(updateGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(['group', groupId]);
            queryClient.invalidateQueries(['groups']); // Invalider la liste des groupes aussi
            closeModal();
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la modification du groupe.';
            setFormErrors({ submit: errorMessage });
            console.error("Error updating group:", error);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!groupId) return;

        if (validateForm()) {
            const groupData = new FormData();
            
            // Ajouter les données du groupe
            groupData.append('name', values.name.trim());
            groupData.append('description', values.description.trim());
            
            // Ajouter l'image si elle a été modifiée
            if (file) {
                groupData.append('profileImg', file);
            }

            updateGroupMutation.mutate({ id: groupId, groupData });
        }
    };

    const imagePreviewUrl = file 
        ? URL.createObjectURL(file) 
        : profileImg || `https://ui-avatars.com/api/?name=${groupName || ''}`;

    return (
        <Backdrop closeModal={closeModal}>
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto m-4 sm:m-6' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                    <h2 className='text-lg font-semibold text-gray-800'>Modifier le groupe</h2>
                    <button onClick={closeModal} className='text-gray-400 hover:text-gray-600'>
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    {/* Erreur générale */}
                    {formErrors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-600 text-sm">{formErrors.submit}</p>
                        </div>
                    )}

                    {/* Image de profil du groupe */}
                    <div className='flex flex-col items-center'>
                        <label htmlFor="group-image-upload" className="cursor-pointer group relative">
                            <img 
                                src={imagePreviewUrl} 
                                alt="group-preview" 
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={28} className="text-white" />
                            </div>
                        </label>
                        <input 
                            id="group-image-upload" 
                            name="profileImg" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange} 
                        />
                        <p className="text-xs text-gray-500 mt-2">Cliquez pour changer l'image</p>
                    </div>

                    {/* Nom du groupe */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du groupe *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Ex: Groupe de prière"
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    {/* Description du groupe */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            value={values.description}
                            onChange={handleChange}
                            placeholder="Décrivez l'objectif et les activités de votre groupe..."
                        />
                        {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                            {values.description.length}/500 caractères
                        </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={updateGroupMutation.isLoading}
                            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {updateGroupMutation.isLoading ? 'Modification...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </Backdrop>
    );
}

export default GroupProfileModal;
