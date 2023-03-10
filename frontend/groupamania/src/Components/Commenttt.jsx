import React, { useContext, useState } from 'react'
import navStyle from '../Styles/timeline.module.css';
import style from '../Styles/comment.module.css';
import Comment from './Comment';
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from '../Context/AuthContext';
import { createComment } from '../Services/commentService';

export default function Commenttt({postId, comments}) {
  const [commentText, setComment] = useState('');
  const queryClient = useQueryClient();
  const userData = useContext(AuthContext)

  const commentMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments')
    }
  })

  console.log(postId)

  const handleComment = (event) => {
      event.preventDefault();
      const comment = new FormData();
      comment.append('text', commentText);
      comment.append('PostId', postId);

      commentMutation.mutate({
          text: commentText,
          PostId: postId
      })  
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }

  return (
    <div style={{padding: '0.5rem 0rem'}}>
     <div className={style.comment_box}>
        <div><img alt="profileImage" src={userData.profileImg} className={style.profile_img}/></div> 
        <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.input}></input>
            <button type="submit" className="btn btn-danger p-1" onClick={handleComment}>Comment</button>
      </div>
      {comments && comments.filter(comment => comment.PostId === postId).map(filteredComment => ( 
                <Comment text={filteredComment.text} date={filteredComment.createdAt} profileImg={filteredComment.User.profileImg} username={filteredComment.User.name} key={filteredComment.id}/>
            ))}
    </div>
  )
}
