import { BrowserRouter, Routes, Route, Navigate } from  "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* Redirect root to login */}

                <Route
                    path="/" 
                    element={<Navigate to= "/login" replace />}
                />

                {/* Authentication */}

                <Route
                    path="/register" 
                    element={<Register />}
                />

                <Route
                    path="/login" 
                    element={<Login />}
                />

                <Route
                    path="/verifyEmail" 
                    element={<VerifyEmail />}
                />

                <Route
                    path="/forgotPassword" 
                    element={<ForgotPassword />}
                />

                <Route
                    path="/resetPassword" 
                    element={<ResetPassword />}
                />

                {/* Protected route */}

                <Route
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;