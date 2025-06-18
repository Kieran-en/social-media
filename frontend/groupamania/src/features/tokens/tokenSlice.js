import { createSlice } from "@reduxjs/toolkit";

const initialState = ""; // OK pour un token

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => action.payload, // remplace complètement l'état

    deleteToken: () => "", // retourne explicitement une string vide
  },
});

export const { setToken, deleteToken } = tokenSlice.actions;
export default tokenSlice.reducer
