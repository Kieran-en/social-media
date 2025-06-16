import React, { useContext, useState } from 'react'
import navStyle from '../Styles/timeline.module.css';
import style from '../Styles/comment.module.css';
import Comment from './Comment';
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from '../Context/AuthContext';
import { createComment } from '../Services/commentService';
import { getCurrentUser } from '../Services/userService';
import { useSelector } from 'react-redux';

export default function Commenttt({postId, comments}) {
  const [commentText, setComment] = useState('');
  const queryClient = useQueryClient();
  const token = useSelector(state => state.token)
  const userData = getCurrentUser(token);
  const {userId} = userData

  const commentMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
      setComment('');
    }
  })

  const handleComment = (event) => {
      event.preventDefault();
      const comment = new FormData();
      comment.append('text', commentText);
      comment.append('PostId', postId);

      commentMutation.mutate({
          text: commentText,
          PostId: postId,
          userId: userId
      })  
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }

  return (
    <div>
     <div className={style.comment_box}>
        {/* <div style={{paddingBottom: '1rem'}}><img alt="profileImage" src={userData.profileImg} className={style.profile_img}/></div>  */}
        <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.input}></input>
            <button type="submit" className="btn p-1" style={{backgroundColor: '#0F6E5A', color: 'white'}} onClick={handleComment}>Comment</button>
      </div>
      {comments && (comments.filter(comment => comment.PostId === postId) && comments.filter(comment => comment.PostId === postId)).map(filteredComment => ( 
                <Comment text={filteredComment && filteredComment.text} 
                date={filteredComment && filteredComment.createdAt}
                 profileImg={filteredComment.User && filteredComment.User.profileImg} 
                 username={filteredComment.User && filteredComment.User.name} key={filteredComment && filteredComment.id}/>
            ))}
    </div>
  )
}
