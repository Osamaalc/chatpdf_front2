// src/hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to handle authentication-based redirects
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirects to login when not authenticated
 * @param {boolean} options.redirectIfAuth - If true, redirects away when authenticated
 * @param {string} options.redirectTo - Path to redirect to
 * @returns {boolean} - True if the user should be allowed to access the current page
 */
const useAuthRedirect = ({ requireAuth = false, redirectIfAuth = false, redirectTo = null }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Wait until authentication state is determined
        if (loading) return;

        // Scenario 1: Require authentication but user is not authenticated
        if (requireAuth && !isAuthenticated) {
            // Save current location for post-login redirect
            navigate('/login', { state: { from: location.pathname }, replace: true });
        }

        // Scenario 2: Redirect if authenticated (for login/register pages)
        if (redirectIfAuth && isAuthenticated) {
            // Redirect to saved location or default location
            const from = location.state?.from || redirectTo || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, location, requireAuth, redirectIfAuth, redirectTo]);

    // Return whether the current authentication state matches the requirements
    return loading ? false : (requireAuth ? isAuthenticated : true);
};

export default useAuthRedirect;