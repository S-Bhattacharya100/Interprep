import { createSlice } from "@reduxjs/toolkit";
import { refreshToken } from "./authApi";

const accessToken = localStorage.getItem("accessToken");

const initialState = {
    user: null,
    accessToken: accessToken,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !! accessToken,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.loading = false;

            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },

        logout: (state, action) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;