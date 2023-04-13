import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from '../features/conversations/conversationSlice'

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        //You may add multiple reducers here if you wish. Because redux recommends having only one store
    }
})