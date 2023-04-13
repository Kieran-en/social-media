import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

export const conversationSlice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        setConversation: (state) => {
            state = {...state}
        }
    }
})

export const { setConversation } = conversationSlice.actions;

export default conversationSlice.reducer