import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

export const conversationSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        //setConversation here is an action name
        setConversation: (state, action) => {
            state = {...action.payload}
        },
    }
})

export const { setConversation } = conversationSlice.actions;

export default conversationSlice.reducer