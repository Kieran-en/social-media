import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  senderId: null,
  receiverId: null,
};

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversation: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        senderId: action.payload.senderId,
        receiverId: action.payload.receiverId,
      };
    },
    clearConversation: () => {
      return initialState;
    }
  }
});

export const { setConversation, clearConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
