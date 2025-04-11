// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    requestPasswordReset,
    firebaseAuth
} from '../services/firebaseService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

    // Check authentication state when app loads
    useEffect(() => {
        console.log("Initializing auth state listener");

        // First check for locally stored token
        const token = localStorage.getItem('token');
        if (token) {
            console.log("Found locally stored token");
        }

        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
            try {
                console.log("Auth state change:", user ? "logged in" : "not logged in");

                if (user) {
                    // We have a logged in user, load at least basic user data
                    const basicUserData = {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                        emailVerified: user.emailVerified
                    };

                    // Set authentication state immediately to avoid delay
                    setCurrentUser(basicUserData);
                    setIsAuthenticated(true);

                    // Try to update the token
                    try {
                        const newToken = await user.getIdToken();
                        localStorage.setItem('token', newToken);
                        console.log("Updated locally stored token");
                    } catch (tokenError) {
                        console.warn("Failed to update token:", tokenError);
                    }

                    // Try to get additional data from Firestore (asynchronously)
                    getCurrentUser()
                        .then(userData => {
                            if (userData && userData !== basicUserData) {
                                console.log("Updated user data with Firestore data");
                                setCurrentUser(userData);
                            }
                        })
                        .catch(err => {
                            console.warn("Failed to load additional Firestore data:", err);
                        });
                } else {
                    // No logged in user
                    console.log("No logged in user - removing locally stored token");
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error("Auth verification failed:", err);
                setError(err.message);
                // Even with an error, try to set authentication state if user exists
                if (firebaseAuth.currentUser) {
                    setIsAuthenticated(true);
                    setCurrentUser({
                        uid: firebaseAuth.currentUser.uid,
                        email: firebaseAuth.currentUser.email,
                        name: firebaseAuth.currentUser.displayName
                    });
                } else {
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                }
            } finally {
                console.log("Auth state check complete - loading=false");
                setLoading(false);
                setInitialAuthCheckDone(true);
            }
        }, (error) => {
            console.error("Error in auth state listener:", error);
            setLoading(false);
            setError(error.message);
            setInitialAuthCheckDone(true);
        });

        // Clean up subscriber when component unmounts
        return () => {
            console.log("Cleaning up auth state listener");
            unsubscribe();
        };
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            console.log("Starting login process");
            setError(null);
            setLoading(true);

            const response = await loginUser(email, password);
            console.log("Login successful:", response ? "yes" : "no");

            if (response && response.token) {
                // Store token
                localStorage.setItem('token', response.token);
                console.log("Token stored locally");

                // Set user data and authentication state directly
                setCurrentUser(response.user);
                setIsAuthenticated(true);
            } else {
                console.warn("No token or user returned from loginUser");
            }

            // End loading state
            setLoading(false);

            return response;
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    // Signup function
    const signup = async (email, password, name) => {
        try {
            console.log("Starting registration process in AuthContext");
            setError(null);
            setLoading(true);

            const response = await registerUser(email, password, name);
            console.log("Registration completed successfully:", response ? "yes" : "no");

            // End loading state after registration
            setLoading(false);

            return response;
        } catch (err) {
            console.error("Error in AuthContext:", err);
            setError(err.message);
            setLoading(false);
            throw err; // Re-throw the error to be handled in RegisterPage
        }
    };

    // Logout function
    const logout = async () => {
        try {
            console.log("Starting logout process");
            setLoading(true);
            await logoutUser();

            // Remove token and user data
            localStorage.removeItem('token');
            setCurrentUser(null);
            setIsAuthenticated(false);
            console.log("Logout successful");
        } catch (err) {
            console.error('Logout error:', err);
            setError(err.message);
        } finally {
            console.log("Logout process ended");
            setLoading(false);
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            console.log("Starting profile update process");
            setError(null);
            setLoading(true);

            const updatedUser = await updateUserProfile(userData);
            console.log("Profile update:", updatedUser ? "successful" : "failed");

            if (updatedUser) {
                setCurrentUser(prev => ({ ...prev, ...updatedUser }));
            }

            return updatedUser;
        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message);
            throw err;
        } finally {
            console.log("Profile update process ended");
            setLoading(false);
        }
    };

    // Request password reset
    const requestReset = async (email) => {
        try {
            console.log("Starting password reset request process");
            setError(null);
            setLoading(true);

            const response = await requestPasswordReset(email);
            console.log("Password reset request sent successfully");
            return response;
        } catch (err) {
            console.error("Password reset request error:", err);
            setError(err.message);
            throw err;
        } finally {
            console.log("Password reset request process ended");
            setLoading(false);
        }
    };

    // Check token validity
    const checkTokenValidity = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }

            // Can develop this function to perform a real token check

            return isAuthenticated;
        } catch (err) {
            console.error("Token validity check error:", err);
            return false;
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        error,
        initialAuthCheckDone,
        login,
        signup,
        logout,
        updateProfile,
        requestReset,
        checkTokenValidity
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;