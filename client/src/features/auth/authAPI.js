import axiosInstance from "../../utils/axiosInstance";

export const registerUser = (userData) => {
    return axiosInstance.post("auth/register", userData);
}
export const resendVerification = (emailData) => {
    return axiosInstance.post("auth/resend-verification", emailData);
}
export const loginUser = (credentials) => {
    return axiosInstance.post("auth/login", credentials);
}
export const verifyEmail = (token) => {
    return axiosInstance.get(`auth/verify-email?token=${token}`);
}
export const forgotPassword = (emailData) => {
    return axiosInstance.post("auth/forgot-password", emailData);
}
export const resetPassword = (resetData) => {
    return axiosInstance.post("auth/reset-password", resetData);
}
export const refreshToken = (refreshTokenData) => {
    return axiosInstance.post("auth/refresh", refreshTokenData);
}
export const logoutUser = (refreshTokenData) => {
    return axiosInstance.post("auth/logout", refreshTokenData);
}
