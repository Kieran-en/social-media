import React, { useState } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import Backdrop from './Backdrop';
import '../Styles/Modal.css';
import style from '../Styles/timeline.module.css';
import { FaImages } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { modifyPost } from '../Services/postService';
import { useMutation, useQueryClient } from 'react-query';

export default function Modal({ closeModal, postToModify }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { userlogged } = useParams();
  const queryClient = useQueryClient();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const validate = (text) => {
    if (text.trim().length < 1) {
      setError('Post should be at least 1 character');
      return false;
    }
    return true;
  };

  const updatePostMutation = useMutation(modifyPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      closeModal(); // ✅ Close modal on success
    },
    onError: (err) => {
      console.error('Failed to update post:', err);
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate(text)) return;

    const post = new FormData();
    post.append('text', text);
    if (selectedFile) post.append('image', selectedFile);
    post.append('postId', postToModify);

    updatePostMutation.mutate(post);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <Backdrop closeModal={closeModal}>
      <div className='modalll' onClick={(e) => e.stopPropagation()}>
        <div className='topModalll'>
          <span>Hey, {userlogged}!</span>
          <span>
            <IoCloseCircleOutline style={{ cursor: 'pointer' }} onClick={closeModal} />
          </span>
        </div>

        <textarea
          placeholder="You've changed your mind?"
          value={text}
          style={{ height: '200px' }}
          onChange={handleChange}
        />

        {selectedFile && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            style={{
              width: '400px',
              height: '300px',
              objectFit: 'cover',
              marginBottom: '10px',
              borderRadius: '10px'
            }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', width: '90%' }}>
          <label htmlFor='uplaod-modify' className={style.multimediaLabel}>
            Media <FaImages />
          </label>
          <input
            id='uplaod-modify'
            name='image'
            type='file'
            className={style.multimediaInput}
            onChange={changeHandler}
          />
        </div>

        {error && <p className="text-warning">{error}</p>}

        <button type='submit' className='button' onClick={handleSubmit}>
          Publish
        </button>
      </div>
    </Backdrop>
  );
}
