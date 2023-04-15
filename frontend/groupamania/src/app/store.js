import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from '../features/conversations/conversationSlice'
import userReducer from '../features/users/userSlice'

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        user: userReducer,
        //You may add multiple reducers here if you wish. Because redux recommends having only one store. You'll separte them with commas
    }
})