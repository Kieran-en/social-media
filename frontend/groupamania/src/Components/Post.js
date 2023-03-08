import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {MdDelete, MdBorderColor} from "react-icons/md";
import navStyle from '../Styles/timeline.module.css';
import {FaThumbsUp} from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import style from '../Styles/timeline.module.css';
import { useState } from "react";
import Comment from "./Comment";
import Commenttt from "./Comment";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import dayjs from 'dayjs';
import { createComment } from "../Services/commentService";
import { like, getNumLikes, isPostLiked } from "../Services/likeService";
import { useQuery, useMutation, useQueryClient } from "react-query";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const Post = ({picture, profileImg, content, username, userLoggedIn, postId, userId, changeModalState, comments, changeDeleteModalState, date}) => {

    const [commentText, setComment] = useState('');
    const [postLiked, setPostLiked] = useState(false);
    //const [numLikes, setNumLikes] = useState();
    const [showComment, setShowComemnt] = useState(false)
    const queryClient = useQueryClient();

    const {error, data : numLikes, status} = useQuery('numLikes', getNumLikes)

  const toggleShowComment = () => {
        setShowComemnt(!showComment)
    }

    console.log(comments && comments)

    const handleChange = (event) => {
        setComment(event.target.value)
    } 

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

    const likeMutation = useMutation(like, {
        onSuccess: () => {
            queryClient.invalidateQueries('like')
        }
      })

    const isPostLikedMutation = useMutation(isPostLiked, {
        onSuccess: () => {
            queryClient.invalidateQueries('like')
          }
    })

    
    const handleLike = () => {
        if (!postLiked){

            likeMutation.mutate({
                like: 1,
                postId: postId,
                userId: JSON.parse(localStorage.getItem('userData')).userId
            })

        } else {
            likeMutation.mutate({
                like: 0,
                postId: postId,
                userId: JSON.parse(localStorage.getItem('userData')).userId
            })
        }
    } 
 

    //Checks if file is a video
    const checkFile = (file) => {
        const fileArray = file.split('.');
        return fileArray[fileArray.length - 1] === 'mp4';
    }

    return (
        <div className='container mt-5 mb-5' style={{backgroundColor: '#242526', color: 'white', borderRadius: '10px', width: 'clamp(50%, 800px, 85%)'}}>
            <div className="row d-flex align-items-center justify-content-between">
                <div className="col-sm-7 d-flex align-items-center mt-2">
                <div className="col-sm-4 d-flex align-items-center">
                    <img src={profileImg} onClick={() => console.log('This is the PostID' + postId)} className={navStyle.profileImg}/>
                    <div style={{marginLeft: '10px', fontWeight: 'bold', display: 'flex', flexDirection:'column'}} >
                        <span>{username}</span>
                        <span style={{fontSize: '10px', whiteSpace: 'nowrap', color: '#A8ABAF'}}>{dayjs(date).fromNow()}</span>
                    </div>
                    
                </div>
            
                </div>
                {userLoggedIn === username && <div className="col-sm-2">
                <Tooltip trigger="mouseenter" arrow="true" title="Modify Post?" position="top"><MdBorderColor 
                onClick={() => {
                    changeModalState(postId)
                    }} className={style.icons}/>
                    </Tooltip>  
                <Tooltip title="Delete Post?" arrow="true" trigger="mouseenter" position="top"> <MdDelete  
                onClick={() => {
                    changeDeleteModalState(postId)
                }}
                className={style.icons}/>
                </Tooltip> 
                </div>}
            </div>
            <hr/>
            <div className=" col-sm-12 d-flex justify-content-start">
                <p>{content}</p>
            </div>
            {picture && <div className="border border-dark">
                { checkFile(picture) ? <video controls width="100%" height='450'>
                            <source src={picture}
                             type="video/mp4" />
                           Sorry, your browser doesn't support embedded videos.
                        </video> 
                : <img src={picture} className={navStyle.img} alt={content}/>
                }
            </div>}
            
                <div className="d-flex gap-2 p-2 align-items-center gap-1">   
                        <div><FaThumbsUp style={{color : postLiked ? '#BB2D3B' : 'white', cursor : 'pointer'}} onClick={() => handleLike()}/> {numLikes} </div>
                        <div><MdOutlineComment className="" style={{cursor : 'pointer'}} onClick={() => toggleShowComment()}/> {comments ? comments.length : 0} </div>  
                </div>
                <hr className="m-2"/>

             
            <div id="comment" className="p-2 row">
            <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.textInput}></input>
            <button type="submit" className="btn btn-danger mr-1 mt-2" onClick={handleComment}>Comment</button>
            </div>
            {showComment && <Commenttt></Commenttt>}
            {comments && comments.filter(comment => comment.PostId === postId).map(filteredComment => ( 
                <Comment text={filteredComment.text} date={filteredComment.createdAt} profileImg={filteredComment.User.profileImg} username={filteredComment.User.name} key={filteredComment.id}/>
            ))}
      
                
        </div>
    )
}

export default Post;