// src/components/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext({
    darkMode: false,
    toggleTheme: () => {}
});

// Create the provider component
export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.body.classList.add('dark-theme');
        }
    }, []);

    // Save theme preference whenever it changes
    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // Toggle theme function
    const toggleTheme = () => {
        setDarkMode(!darkMode);

        // Update body class for global theme
        if (!darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;