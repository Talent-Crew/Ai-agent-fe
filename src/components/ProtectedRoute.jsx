import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // IMPORTANT: If we are still checking the session, show nothing or a spinner.
    // Do NOT redirect yet.
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect them to the login page, but save the current location they were
        // trying to go to.
        return <Navigate to="/recruiter/auth" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;