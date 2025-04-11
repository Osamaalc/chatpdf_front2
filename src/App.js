// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './styles/theme.css';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <ChatProvider>
                <Router>
                    <div className="app-container">
                        <Header />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/chat/:id" element={<ChatPage />} />
                            {/* Add additional routes here */}
                        </Routes>
                        <Footer />
                    </div>
                </Router>
            </ChatProvider>
        </ThemeProvider>
    );
}

export default App;