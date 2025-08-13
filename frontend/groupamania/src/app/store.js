import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from '../features/conversations/conversationSlice'
import tokenReducer from '../features/tokens/tokenSlice'
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  senderId: null,
  receiverId: null,
};

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        token: tokenReducer,
        //You may add multiple reducers here if you wish. Because redux recommends having only one store. You'll separte them with commas
    }
})

export const conversationSlice = createSlice({
  name: 'conversation',
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