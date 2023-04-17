import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from '../features/conversations/conversationSlice'
import tokenReducer from '../features/tokens/tokenSlice'

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        token: tokenReducer,
        //You may add multiple reducers here if you wish. Because redux recommends having only one store. You'll separte them with commas
    }
})