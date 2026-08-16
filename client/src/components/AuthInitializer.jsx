import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../features/auth/authAPI";
import { setUser, logout } from "../features/auth/authSlice";

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("accessToken");

            if(!accessToken) {
                return;
            }

            try {

                const response = await getCurrentUser();

                dispatch(setUser(response.data.user));

            } catch (error) {
                
                console.error(
                    error.response?.data || error.message
                );

                localStorage.removeItem("accessToken");
            }
        }

        initializeAuth();

    }, [dispatch]);

    return children;
}

export default AuthInitializer;