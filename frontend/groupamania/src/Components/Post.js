import React, {memo} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {MdDelete, MdBorderColor} from "react-icons/md";
import navStyle from '../Styles/timeline.module.css';
import {FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown} from "react-icons/fa";
import style from '../Styles/timeline.module.css';
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Comment from "./Comment";
import { CommentContext } from "../Context/CommentContext";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const Post = ({picture, profileImg, content, likes, dislikes, username, userLoggedIn, postId, userId, changeModalState, allComments, changeDeleteModalState, date}) => {

    const [commentText, setComment] = useState('');
    const {comments, setComments} = useContext(CommentContext);
    const [postLiked, setPostLiked] = useState(false);
    const [numLikes, setNumLikes] = useState();

    const getNumLikes = () => {
        axios.get(`http://localhost:3000/api/like/${postId}`)
        .then(response => {
            console.log(response.data)
            setNumLikes(response.data)
        })
        .catch(error => console.log(error))  
    }

    const handleChange = (event) => {
        setComment(event.target.value)
    } 

    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const handleComment = (event) => {
        event.preventDefault();
        const comment = new FormData();
        comment.append('text', commentText);
        comment.append('PostId', postId);

           axios.post('http://localhost:3000/api/comment', {
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
        if (!postLiked){
            axios.post('http://localhost:3000/api/like', {
               like: 1,
               postId: postId,
               userId: JSON.parse(localStorage.getItem('userData')).userId
           })
           .then(res => {
            getNumLikes()
        })
           .catch(error => console.log(error))
            setPostLiked(true)
        } else {
            axios.post('http://localhost:3000/api/like', {
               like: 0,
               postId: postId,
               userId: JSON.parse(localStorage.getItem('userData')).userId
           })
           .then(res => {
            getNumLikes()
        })
           .catch(error => console.log(error))
            setPostLiked(false)
        }
    }


    useEffect(() => {
        getNumLikes();
    }, [])

    useEffect(() => {
        //Checking if post is liked by verifying if there's a pair user & post Id's in the like table
        axios.post('http://localhost:3000/api/like/postLiked', {
            postId: postId,
            userId: JSON.parse(localStorage.getItem('userData')).userId
        })
        .then(res => {
            if (res.data.message === 'true'){
                setPostLiked(true)
            }
        })
        .catch(error => console.log(error)) 
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
            <div>
                <div className="d-flex row p-2">
                    <div className="col-sm-2" onClick={handleLike}><FaThumbsUp style={{color : postLiked ? '#BB2D3B' : 'white'}}/> {numLikes} </div>
                </div>
                <hr className="m-2"/>
            </div>
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