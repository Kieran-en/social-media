import { createSlice } from "@reduxjs/toolkit";

let initialState = ""

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            console.log(action.payload)
            state = action.payload
            console.log("state", state)
            return state
        },
        deleteToken: (state) => {
            state = ''
        }
    }
})

export const { setToken, deleteToken } = tokenSlice.actions;

export default tokenSlice.reducer