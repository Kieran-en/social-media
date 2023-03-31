import React from 'react';
import Backdrop from './Backdrop';
import { IoCloseCircleOutline } from "react-icons/io5";
import style from '../Styles/deletemodal.module.css';
import { deletePost } from '../Services/postService';
import { useMutation, useQueryClient } from 'react-query';

export default function DeleteModal({closeModal, postToDelete}) {

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
    }
  })

  function handleDelete(event){
    event.preventDefault();

    /**const post = new FormData();
    post.append('postId', postToDelete);
    console.log(post) */
   deletePostMutation.mutate(postToDelete)
  }

  return (
      <Backdrop closeModal={closeModal}>
          <div className={style.modal}>
            <div className={style.top}>
            <span>
         < IoCloseCircleOutline  style={{cursor: 'pointer'}} onClick={() => {closeModal()}}/>
         </span>
            </div>
            <div className={style.middleText}><p>Are you sure you want to delete this post?</p></div>
            <div className={style.buttons}>
              <button onClick={closeModal} className={style.cancelButton}>Cancel</button>
              <button type='submit' className={style.deleteButton} onClick={handleDelete}>Delete</button>
            </div>
          </div>
      </Backdrop>
  )
}
