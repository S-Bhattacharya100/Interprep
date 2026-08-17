import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {

    const { isAuthenticated, authInitialized } = useSelector((state) => state.auth);

    // Authentication check is still running
    if (!authInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if(isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
};

export default PublicRoute;