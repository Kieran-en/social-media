import React, { useState } from 'react'
import { useMutation, useQueryClient } from "react-query";
import { createComment } from '../Services/commentService';
import { getCurrentUser } from '../Services/userService';
import { useSelector } from 'react-redux';
import { Send, MessageSquare } from 'lucide-react';
import Comment from './Comment';

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
        if (!commentText.trim()) return;

        commentMutation.mutate({
            text: commentText,
            PostId: postId,
            userId: userId
        })
    }

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const postComments = comments && comments.filter(comment => comment.PostId === postId);

    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex gap-3 mb-4">
                <img
                    alt="profileImage"
                    src={userData?.profileImg || `https://ui-avatars.com/api/?name=${userData?.username}&background=random`}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 flex gap-2">
                    <input
                        type='text'
                        name='comment'
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                    <button
                        type="submit"
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                            commentText.trim()
                                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-md transform hover:scale-105'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {postComments && postComments.length > 0 && (
                <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">{postComments.length} Comments</span>
                    </div>
                    {postComments.map(filteredComment => (
                        <Comment
                            key={filteredComment?.id}
                            text={filteredComment?.text}
                            date={filteredComment?.createdAt}
                            profileImg={filteredComment.User?.profileImg}
                            username={filteredComment.User?.name}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
