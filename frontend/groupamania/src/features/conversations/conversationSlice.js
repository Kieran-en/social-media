// src/features/conversations/conversationSlice.js

import { createSlice } from "@reduxjs/toolkit";

// --- STEP 1: Update the initial state shape ---
// We need to store the receiver object, not just IDs.
const initialState = {
  id: null,
  receiver: {}, // Use an empty object as a safe default
};

export const conversationSlice = createSlice({
  name: 'conversations', // The name was 'conversations', let's keep it consistent
  initialState,
  reducers: {
    // --- STEP 2: Fix the reducer ---
    setConversation: (state, action) => {
      // The payload is the correctly shaped object we want for our state.
      // By returning it directly, Redux Toolkit will replace the old state
      // with this new, complete object.
      return action.payload;
    },
    clearConversation: (state) => {
      // This will now correctly reset the state to the new initial state
      return initialState;
    }
  }
});

export const { setConversation, clearConversation } = conversationSlice.actions;

export default conversationSlice.reducer;