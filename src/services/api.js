// src/services/api.js
import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            // Clear the auth token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Handle rate limiting
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded. Please try again later.');
        }

        // Handle server errors
        if (error.response && error.response.status >= 500) {
            console.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default api;