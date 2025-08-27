// src/Components/DeleteModal.jsx

import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { deletePost } from '../Services/postService';
import Backdrop from './Backdrop';
// Remplacement des icônes pour la cohérence
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ closeModal, postToDelete }) {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      closeModal(); // Ferme le modal après le succès
    },
    onError: (error) => {
      alert("Failed to delete the post. Please try again."); // Feedback simple pour l'utilisateur
      console.error("Delete failed:", error.response?.data || error.message);
    }
  });

  const { isLoading } = deletePostMutation;

  function handleDelete() {
    deletePostMutation.mutate(postToDelete);
  }

  return (
    <Backdrop closeModal={closeModal}>
      {/* La carte du modal, avec `onClick` pour éviter sa fermeture si on clique dessus */}
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto p-6 text-center" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icône d'avertissement */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        
        {/* Texte de confirmation */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">
            Delete Post
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}