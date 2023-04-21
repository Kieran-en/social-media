import { createSlice } from "@reduxjs/toolkit";

let initialState = ""

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state = action.payload
            return state
        },
        deleteToken: (state) => {
            state = ''
        }
    }
})

export const { setToken, deleteToken } = tokenSlice.actions;

export default tokenSlice.reducer