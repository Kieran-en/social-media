import { createSlice } from "@reduxjs/toolkit";

let initialState = {};

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state =  {...state, userId: action.payload.userId, 
                username: action.payload.username,
                profileImg: action.payload.profileImg} 
            return state
        },
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer