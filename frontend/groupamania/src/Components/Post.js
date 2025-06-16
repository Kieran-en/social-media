import React, { useState } from "react";
import { MdDelete, MdBorderColor } from "react-icons/md";
import { FaThumbsUp } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { Tooltip } from 'react-tippy';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { like, getNumLikes, isPostLiked } from "../Services/likeService";
import { getCurrentUser } from "../Services/userService";

import Commenttt from "./Commenttt";
import style from '../Styles/timeline.module.css';
import 'react-tippy/dist/tippy.css';

dayjs.extend(relativeTime);

const Post = React.forwardRef(({ picture, profileImg, content, username, userLoggedIn, postId, userId, changeModalState, comments, likes, changeDeleteModalState, date }, ref) => {
    const [showComment, setShowComment] = useState(false);
    const queryClient = useQueryClient();
    const token = useSelector(state => state.token);
    const userData = getCurrentUser(token);
    const navigate = useNavigate();

    const { data: numLikes } = useQuery('numLikes', () => getNumLikes(postId));
    const { data: count } = useQuery(['isPostLiked', postId], () => isPostLiked(userId, postId));

    const toggleShowComment = () => setShowComment(!showComment);

    const likeMutation = useMutation(like, {
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries(['isPostLiked', postId]),
            queryClient.invalidateQueries('posts')
        ])
    });

    const handleLike = () => {
        likeMutation.mutate({
            like: count > 0 ? 0 : 1,
            postId,
            userId: userData.userId
        });
    };

    const checkFile = (file) => {
        const ext = file.split('.').pop();
        return ext === 'mp4';
    };

    return (
        <div ref={ref} className={style.postCard}>
            <div className={style.postHeader}>
                <div className={style.profileSection} onClick={() => navigate(`/profilepage/${username}`)}>
                    <img src={profileImg} className={style.profileImg} />
                    <div className={style.usernameBlock}>
                        <span className={style.username}>{username}</span>
                        <span className={style.timestamp}>{dayjs(date).fromNow()}</span>
                    </div>
                </div>

                {userLoggedIn === username && (
                    <div className={style.iconGroup}>
                        <Tooltip title="Modify Post?" arrow trigger="mouseenter" position="top">
                            <MdBorderColor onClick={() => changeModalState(postId)} className={style.icons} />
                        </Tooltip>
                        <Tooltip title="Delete Post?" arrow trigger="mouseenter" position="top">
                            <MdDelete onClick={() => changeDeleteModalState(postId)} className={style.icons} />
                        </Tooltip>
                    </div>
                )}
            </div>

            <div className={style.postContent}>
                {content}
            </div>

            {picture && (
                checkFile(picture) ? (
                    <video controls className={style.media}>
                        <source src={picture} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img src={picture} alt="post media" className={style.media} />
                )
            )}

            <div className={style.postActions}>
                <div onClick={handleLike}>
                    <FaThumbsUp style={{ color: count > 0 ? '#0F6E5A' : 'inherit' }} /> {likes}
                </div>
                <div onClick={toggleShowComment}>
                    <MdOutlineComment /> {comments?.filter(c => c.PostId === postId).length || 0}
                </div>
            </div>

           {showComment && (
  <div className={style.commentsContainer}>
    <Commenttt comments={comments} postId={postId} />
  </div>
)}
        </div>
    );
});

export default Post;
