import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach Access token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// Handle expired access token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if(!refreshToken) {
                    throw new Error("Refresh token not found");
                }

                const response = await axios.post(

                    "http://localhost:3000/api/auth/refresh",
                    {
                        refreshToken
                    }
                );

                const newAccessToken = response.data.newAccessToken;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;