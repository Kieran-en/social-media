import React, {memo} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {MdDelete, MdBorderColor} from "react-icons/md";
import navImg from '../Images/icon-above-font.png';
import navStyle from '../Styles/timeline.module.css';
import {FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown} from "react-icons/fa";
import style from '../Styles/timeline.module.css';
import { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { getAccessToken } from "../accessToken";
import Comment from "./Comment";
import { useContext } from "react";
import { CommentContext } from "../Context/CommentContext";
import 'react-tippy/dist/tippy.css';
import {Tooltip,} from 'react-tippy';

const Post = ({picture, profileImg, content, likes, dislikes, username, userLoggedIn, postId, changeModalState, allComments, changeDeleteModalState}) => {

    const [commentText, setComment] = useState('');
    const {comments, setComments} = useContext(CommentContext);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    //console.log(comments)
    const [hasImage, setHasImage] = useState(false);

    const handleChange = (event) => {
        setComment(event.target.value)
    } 

    axios.interceptors.request.use(
        config => {
            config.headers.authorization = `Bearer ${getAccessToken}`;
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
        if (!liked){
            axios.post('http://localhost:3000/api/like', {
               like: 1,
               postId: postId,
               userId: 1
           })
           .then(res => console.log(res))
           .catch(error => console.log(error))
            setLiked(true)
        } else {
            axios.post('http://localhost:3000/api/like', {
               like: 0,
               PostId: postId,
               userId: 1
           })
           .then(res => console.log(res))
           .catch(error => console.log(error))
            setLiked(false)
        }
    }

    const handleDislike = () => {
        if (!disliked){
            axios.post('http://localhost:3000/api/like', {
               like: -1,
               PostId: postId
           })
           .then(res => console.log(res))
           .catch(error => console.log(error))  
            setDisliked(true)
        } else {
            axios.post('http://localhost:3000/api/like', {
               like: 0,
               PostId: postId
           })
           .then(res => console.log(res))
           .catch(error => console.log(error))
            setDisliked(false)
        }
    }


    return (
        <div className='container mt-5 mb-5' style={{backgroundColor: '#242526', color: 'white', borderRadius: '10px', width: 'clamp(50%, 800px, 85%)'}}>
            <div className="row d-flex align-items-center justify-content-between">
                <div className="col-sm-7 d-flex align-items-center mt-2">
                <div className="col-sm-3 d-flex align-items-center">
                    <img src={profileImg} onClick={() => console.log('This is the PostID' + postId)} className={navStyle.profileImg}/>
                    <div style={{marginLeft: '10px', fontWeight: 'bold'}} ><p>{username}</p></div>
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
                <img src={picture} className={navStyle.img} alt={content}/>
            </div>}
            <div>
                <div className="d-flex row p-2">
                    <div className="col-sm-2" onClick={handleLike}>{liked ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}</div>
                    <div className="col-sm-2" onClick={handleDislike}>{disliked ? <FaThumbsDown /> : <FaRegThumbsDown />} {dislikes}</div>
                </div>
                <hr className="m-2"/>
            </div>
            <div id="comment" className="p-2 row">
                <input type='text' name='comment' placeholder="Any comment ?" value={commentText} onChange={handleChange} className={style.textInput}></input>
                <button type="submit" className="btn btn-danger mr-1" onClick={handleComment}>Comment</button>
                </div>
                {comments.filter(comment => comment.PostId === postId).map(filteredComment => ( 
                    <Comment text={filteredComment.text} profileImg={filteredComment.User.profileImg} username={filteredComment.User.name} key={filteredComment.id}/>
                ))}
                
        </div>
    )
}

export default memo(Post);