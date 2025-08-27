import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { modifyPost } from '../Services/postService';
import Backdrop from './Backdrop';
// Icônes pour un look moderne et cohérent
import { X, ImageIcon } from 'lucide-react';

// Le composant reçoit les données initiales du post en props pour plus de clarté
export default function ModifyPostModal({ closeModal, postToModify, initialText, initialImage }) {
  const [text, setText] = useState(initialText || '');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const handleChange = (event) => {
    setText(event.target.value);
    if (error) setError(''); // Efface l'erreur dès que l'utilisateur tape
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const validate = () => {
    if (text.trim().length < 1) {
      setError('Post content cannot be empty.');
      return false;
    }
    return true;
  };

  const updatePostMutation = useMutation(modifyPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      closeModal();
    },
    onError: (err) => {
      alert("Failed to update post. Please try again.");
      console.error('Failed to update post:', err);
    }
  });

  const { isLoading } = updatePostMutation;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const postData = new FormData();
    postData.append('text', text);
    if (file) {
      postData.append('image', file);
    }
    postData.append('postId', postToModify);

    updatePostMutation.mutate(postData);
  };

  // Détermine l'URL de l'image à afficher : soit le nouveau fichier, soit l'image initiale
  const previewUrl = file ? URL.createObjectURL(file) : initialImage;

  return (
    <Backdrop closeModal={closeModal}>
      <div 
        className='bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto flex flex-col' 
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du Modal */}
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-800'>Edit Post</h2>
          <button onClick={closeModal} className='text-gray-400 hover:text-gray-600'>
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex-grow p-6 space-y-4">
          {/* Zone de texte */}
          <div>
            <textarea
              placeholder="What's on your mind?"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={text}
              onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Aperçu de l'image et bouton d'upload */}
          <div className="space-y-2">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Post preview"
                className="w-full h-auto max-h-60 rounded-lg object-cover border border-gray-200"
              />
            )}
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <ImageIcon size={16} />
              {previewUrl ? 'Change Image' : 'Add Image'}
            </label>
            <input 
              id="image-upload" 
              name="image" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
        </form>

        {/* Pied de page avec les boutons d'action */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit} // Permet de soumettre en cliquant sur le bouton
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}