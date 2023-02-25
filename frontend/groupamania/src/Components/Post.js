import React, {memo} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {MdDelete, MdBorderColor} from "react-icons/md";
import navStyle from '../Styles/timeline.module.css';
import {FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown} from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import style from '../Styles/timeline.module.css';
import { useState, useEffect, useContext } from "react";
import http from '../services/httpService';
import Comment from "./Comment";
import { CommentContext } from "../Context/CommentContext";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import dayjs from 'dayjs';
import config from '../config.json';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const Post = ({picture, profileImg, content, username, userLoggedIn, postId, userId, changeModalState, allComments, changeDeleteModalState, date}) => {

    const [commentText, setComment] = useState('');
    const {comments, setComments} = useContext(CommentContext);
    const [postLiked, setPostLiked] = useState(false);
    const [numLikes, setNumLikes] = useState();
    const [showComment, setShowComemnt] = useState(false)

    //console.log(postLiked)
    //console.log(numLikes)

    const toggleShowComment = () => {
        setShowComemnt(!showComment)
    }

    const getNumLikes = () => {
        http.get(`${config.apiEndpoint}/like/${postId}`)
        .then(response => {
            console.log(response.data)
            setNumLikes(response.data)
        })
        .catch(error => console.log(error))  
    }

    const handleChange = (event) => {
        setComment(event.target.value)
    } 

    const handleComment = (event) => {
        event.preventDefault();
        const comment = new FormData();
        comment.append('text', commentText);
        comment.append('PostId', postId);

           http.post(`${config.apiEndpoint}/comment`, {
               text: commentText,
               PostId: postId
           })
           .then(res => {
               console.log(res)
               allComments()
            })
           .catch(error => console.log(error))  
    }

    const handleLike = () => {
        const originalNumberOfLikes = numLikes
        if (!postLiked){
            setNumLikes(prev => prev + 1)
            console.log(numLikes)
            
            http.post('s' + `${config.apiEndpoint}/like`, {
               like: 1,
               postId: postId,
               userId: JSON.parse(localStorage.getItem('userData')).userId
           })
           .then(res => {
            //getNumLikes()
        })
           .catch(error => {
            if(error) setNumLikes(originalNumberOfLikes)
           })
            setPostLiked(true)

        } else {
            const originalNumberOfLikes = numLikes
            setNumLikes(numLikes - 1)
            http.post(`${config.apiEndpoint}/like`, {
               like: 0,
               postId: postId,
               userId: JSON.parse(localStorage.getItem('userData')).userId
           })
           .then(res => {
            getNumLikes()
        })
           .catch(error => {
            if(error) setNumLikes(originalNumberOfLikes)
           })
            setPostLiked(false)
        }
    }

    useEffect(() => {
        getNumLikes();
    }, [])

    useEffect(() => {
        //Checking if post is liked by verifying if there's a pair user & post Id's in the like table
        const originalLikeState = postLiked
        //Optimistic rendering
        try {
            http.post(`${config.apiEndpoint}/like/postLiked`, {
            postId: postId,
            userId: JSON.parse(localStorage.getItem('userData')).userId
        })
        } catch (error) {
            if(error) setPostLiked(originalLikeState)
        }

    }, [])

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
                        <div><FaThumbsUp style={{color : postLiked ? '#BB2D3B' : 'white'}} onClick={handleLike}/> {numLikes} </div>
                        <div><MdOutlineComment className="" onClick={toggleShowComment()}/></div>  
                </div>
                <hr className="m-2"/>

             
            <div id="comment" className="p-2 row">
            <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.textInput}></input>
            <button type="submit" className="btn btn-danger mr-1 mt-2" onClick={handleComment}>Comment</button>
            </div>
            {comments.filter(comment => comment.PostId === postId).map(filteredComment => ( 
                <Comment text={filteredComment.text} date={filteredComment.createdAt} profileImg={filteredComment.User.profileImg} username={filteredComment.User.name} key={filteredComment.id}/>
            ))}
      
                
        </div>
    )
}

export default Post;