import React from 'react'
import navStyle from '../Styles/timeline.module.css';
import Comment from './Comment';
import { useMutation, useQueryClient } from "react-query";

export default function Commenttt({handleChange, postId, comments}) {
  const [commentText, setComment] = useState('');
  const queryClient = useQueryClient();

  const commentMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments')
    }
  })

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

  return (
    <div>
      <div>
        <img alt="profileImage" src=""/> 
        <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.textInput}></input>
            <button type="submit" className="btn btn-danger mr-1 mt-2" onClick={handleComment}>Comment</button>
      </div>
      {comments && comments.filter(comment => comment.PostId === postId).map(filteredComment => ( 
                <Comment text={filteredComment.text} date={filteredComment.createdAt} profileImg={filteredComment.User.profileImg} username={filteredComment.User.name} key={filteredComment.id}/>
            ))}

{/** <div className={navStyle.commentSection}> 
        <div >
        <img src={profileImg} className={navStyle.profileImg}/>
    </div>
    <div className="p-1 d-flex flex-column align-items-start" style={{backgroundColor: '#3A3B3C', borderRadius: '10px', marginLeft: '10px'}}>
      <p style={{paddingLeft: '10px', fontWeight: 'bold'}}>{username}</p> 
      <p style={{paddingLeft: '10px'}}>{text}</p>
      </div>
    <span style={{fontSize: '10px', marginLeft: '5px', color: '#A8ABAF'}}>{dayjs(date).fromNow()}</span>
    </div>
    */}
    </div>
  )
}
