import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {MdDelete, MdBorderColor} from "react-icons/md";
import navStyle from '../Styles/timeline.module.css';
import {FaThumbsUp} from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import style from '../Styles/timeline.module.css';
import { useState } from "react";
import Commenttt from "./Commenttt";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import dayjs from 'dayjs';
import { like, getNumLikes, isPostLiked } from "../Services/likeService";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../Services/userService";
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const Post = ({picture, profileImg, content, username, userLoggedIn, postId, userId, changeModalState, comments, likes, changeDeleteModalState, date}) => {

    const [showComment, setShowComemnt] = useState(false)
    const queryClient = useQueryClient();
    const userData = getCurrentUser() 
    console.log(userData.username)
    const navigate = useNavigate();

    const {error, data : numLikes, status} = useQuery('numLikes', () => getNumLikes(postId))
    const {isLikedError, data : count, isLikedStatus} = useQuery(['isPostLiked', postId], () => isPostLiked(userId, postId))

  const toggleShowComment = () => {
        setShowComemnt(!showComment)
    }

    const likeMutation = useMutation(like, {

        /**  onMutate: async (newLike) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            ///await queryClient.cancelQueries({ queryKey: ['numLikes'] })
            await queryClient.cancelQueries({ queryKey: ['isPostLiked', postId] })
        
            // Snapshot the previous value
           // const previousNumLikes = queryClient.getQueryData(['numLikes'])
            const previousPostLiked = queryClient.getQueryData(['isPostLiked', postId])
        
            // Optimistically update to the new value
            //queryClient.setQueryData(['numLikes'], (old) => count > 0 ? old-- : old++ )
            queryClient.setQueryData(['isPostLiked', postId], (old) => count > 0 ? old-- : old++)
        
            // Return a context object with the snapshotted value
            return {  previousPostLiked }
          },
          // If the mutation fails,
          // use the context returned from onMutate to roll back
          onError: (err, newTodo, context) => Promise.all([
            //queryClient.setQueryData(['numLikes'], context.previousNumLikes),
            queryClient.setQueryData(['isPostLiked', postId], context.previousPostLiked)
          ]),
          
        
          
          // Always refetch after error or success:
          onSettled: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ['posts'] }),
            queryClient.invalidateQueries({ queryKey: ['isPostLiked', postId] })
          ]),
*/

       
 onSuccess: () => Promise.all([
            queryClient.invalidateQueries(['isPostLiked', postId]),
            queryClient.invalidateQueries('posts')
        ]) 
         
      })
    
    const handleLike = () => {
        if (!(count > 0)){

            likeMutation.mutate({
                like: 1,
                postId: postId,
                userId: userData.userId
            })

        } else {
            likeMutation.mutate({
                like: 0,
                postId: postId,
                userId: userData.userId
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
                <div className="col-sm-7 d-flex align-items-center mt-2 ">
                <div className="col-sm-4 d-flex align-items-center " style={{cursor: 'pointer'}}
                 onClick={() => navigate(`/profilepage/${username}`)}>
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
                        <div><FaThumbsUp style={{color : count > 0 ? '#0F6E5A' : 'white', cursor : 'pointer'}} onClick={() => handleLike()}/> {likes} </div>
                        <div><MdOutlineComment className="" style={{cursor : 'pointer'}} onClick={() => toggleShowComment()}/> {comments ? comments.filter(comment =>
                            comment.PostId === postId).length : 0} </div>  
                </div>

            {showComment && <Commenttt comments={comments} postId={postId}/>}
            
      
                
        </div>
    )
}

export default Post;