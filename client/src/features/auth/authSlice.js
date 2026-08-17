import { createSlice } from "@reduxjs/toolkit";

const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

const initialState = {
    user: null,
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    isAuthenticated: !!storedAccessToken,
    authInitialized: false,
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
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },

        authInitialized: (state, action) => {
            state.authInitialized = true;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, authInitialized } = authSlice.actions;
export default authSlice.reducer;