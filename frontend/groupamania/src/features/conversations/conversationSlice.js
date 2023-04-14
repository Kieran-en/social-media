import { createSlice } from "@reduxjs/toolkit";

let initialState = {};

export const conversationSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        //setConversation here is an action name
        setConversation: (state, action) => {
            state =  {...state, senderId: action.payload.senderId, receiverId: action.payload.receiverId} 
            return state
        },
    }
})

export const { setConversation } = conversationSlice.actions;

export default conversationSlice.reducer