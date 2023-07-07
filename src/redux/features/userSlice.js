import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    onUserSuccess: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(state.userDetails));
    },
    onLogoutUser: (state) => {
      state.userDetails = null;
      localStorage.removeItem("userInfo");
    },
    onUserUpdate: (state, action) =>{
      state.userDetails = {...state.userDetails, ...action.payload},
      localStorage.setItem("userInfo", JSON.stringify(state.userDetails))
    }
  },
});

export const { onUserSuccess, onLogoutUser, onUserUpdate } = userSlice.actions;
export default userSlice.reducer;
