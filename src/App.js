// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import './styles/theme.css';
import './App.css';

// Component to redirect to login when not authenticated
const AuthCheck = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // If still loading auth state, show nothing to prevent flash
    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render children if authenticated
    return children;
};

// Component that requires no authentication (redirects away if authenticated)
const NoAuth = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // If still loading auth state, show nothing to prevent flash
    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    // Redirect to home if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Render children if not authenticated
    return children;
};

// Root component that provides Context Providers
const AppProviders = ({ children }) => (
    <ThemeProvider>
        <AuthProvider>
            <ChatProvider>
                {children}
            </ChatProvider>
        </AuthProvider>
    </ThemeProvider>
);

// Main App Component
function AppContent() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Auth Routes - No Header/Footer */}
                    <Route path="/login" element={
                        <NoAuth>
                            <LoginPage />
                        </NoAuth>
                    } />
                    <Route path="/register" element={
                        <NoAuth>
                            <RegisterPage />
                        </NoAuth>
                    } />
                    <Route path="/forgot-password" element={
                        <NoAuth>
                            <ForgotPasswordPage />
                        </NoAuth>
                    } />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <AuthCheck>
                            <Header />
                            <HomePage />
                            <Footer />
                        </AuthCheck>
                    } />

                    <Route path="/chat/:id" element={
                        <AuthCheck>
                            <Header />
                            <ChatPage />
                            <Footer />
                        </AuthCheck>
                    } />

                    <Route path="/profile" element={
                        <AuthCheck>
                            <Header />
                            <ProfilePage />
                            <Footer />
                        </AuthCheck>
                    } />

                    {/* Redirect for unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

// Initialize app with all providers
function App() {
    return (
        <AppProviders>
            <AppContent />
        </AppProviders>
    );
}

export default App;