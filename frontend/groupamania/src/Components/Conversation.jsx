import React from 'react';
import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { createConversation } from '../Services/conversationService';
import { getCurrentUser } from '../Services/userService';
import { setConversation } from '../features/conversations/conversationSlice';
import styles from '../Styles/conversation.module.css';

function Conversation({ receiverId, name, profileImg, socket }) {
    // --- DEBUG LOG 1: Check if the initial props are correct ---
    // console.log(`[Conversation Component] Rendering for: ${name}`, { receiverId, name, profileImg });

    const token = useSelector(state => state.token);
    const currentUser = getCurrentUser(token);
    const { userId: senderId } = currentUser;
    const dispatch = useDispatch();

    const conversationMutation = useMutation(createConversation, {
        onSuccess: (data) => {
            // --- DEBUG LOG 3: Check what the API returns ---
            // console.log('[Mutation Success] API returned:', data);

            const newConversationState = {
                id: data.id,
                receiver: {
                    userId: receiverId,
                    username: name,
                    profileImg: profileImg
                }
            };

            // --- DEBUG LOG 4: Check the object we are about to dispatch ---
            // console.log('[Dispatching to Redux] Payload:', newConversationState);

            dispatch(setConversation(newConversationState));
            
            socket.current.emit('join_room', {
                room: data.id,
                senderId
            });
        },
        onError: (error) => {
            // --- DEBUG LOG (ERROR): This will tell us if the API call is failing ---
            // console.error('[Mutation Error] Failed to create/get conversation:', error);
        }
    });

    const addConversation = () => {
        const mutationData = {
            receiverId: receiverId,
            senderId: senderId
        };
        // --- DEBUG LOG 2: Check the data being sent to the API ---
        // console.log('[Mutation Start] Calling createConversation with:', mutationData);
        conversationMutation.mutate(mutationData);
    };

    return (
        <div className={styles.conversation} onClick={addConversation}>
            <img src={profileImg} alt="conversation-image" className={styles.image}></img>
            <span className={styles.name}>{name}</span>
        </div>
    );
}

export default Conversation;