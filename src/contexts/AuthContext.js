// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is already logged in (token in localStorage)
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Verify token with backend
                    const response = await api.get('/auth/me');
                    setCurrentUser(response.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    // Invalid token, clear it
                    console.error('Auth verification failed:', err);
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            }

            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await api.post('/auth/login', { email, password });

            // Save token to localStorage
            localStorage.setItem('token', response.data.token);

            // Set user data and auth state
            setCurrentUser(response.data.user);
            setIsAuthenticated(true);

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Signup function
    const signup = async (email, password, name) => {
        try {
            setError(null);
            setLoading(true);

            const response = await api.post('/auth/signup', { email, password, name });

            // Save token to localStorage
            localStorage.setItem('token', response.data.token);

            // Set user data and auth state
            setCurrentUser(response.data.user);
            setIsAuthenticated(true);

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Call logout endpoint if needed
            // await api.post('/auth/logout');

            // Clear token and user data
            localStorage.removeItem('token');
            setCurrentUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Logout error:', err);
            // Still clear local data even if API call fails
            localStorage.removeItem('token');
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await api.put('/auth/profile', userData);

            setCurrentUser(response.data);

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Password reset request
    const requestPasswordReset = async (email) => {
        try {
            setError(null);
            setLoading(true);

            const response = await api.post('/auth/reset-password', { email });

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to request password reset. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Confirm password reset with token and new password
    const confirmPasswordReset = async (token, newPassword) => {
        try {
            setError(null);
            setLoading(true);

            const response = await api.post('/auth/reset-password/confirm', {
                token,
                password: newPassword
            });

            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        requestPasswordReset,
        confirmPasswordReset
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;