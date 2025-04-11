// // src/services/authService.js
// import api from './api';
//
// /**
//  * Login user with email and password
//  * @param {Object} credentials - User credentials
//  * @param {string} credentials.email - User email
//  * @param {string} credentials.password - User password
//  * @returns {Promise<Object>} - Response with user data and token
//  */
// export const login = async ({ email, password }) => {
//     try {
//         const response = await api.post('/auth/login', { email, password });
//
//         // Save token to localStorage
//         if (response.data.token) {
//             localStorage.setItem('token', response.data.token);
//         }
//
//         return response.data;
//     } catch (error) {
//         console.error('Login error:', error);
//         throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
//     }
// };
//
// /**
//  * Register a new user
//  * @param {Object} userData - User registration data
//  * @param {string} userData.name - User's name
//  * @param {string} userData.email - User's email
//  * @param {string} userData.password - User's password
//  * @returns {Promise<Object>} - Response with user data and token
//  */
// export const register = async ({ name, email, password }) => {
//     try {
//         const response = await api.post('/auth/register', { name, email, password });
//
//         // Save token to localStorage
//         if (response.data.token) {
//             localStorage.setItem('token', response.data.token);
//         }
//
//         return response.data;
//     } catch (error) {
//         console.error('Registration error:', error);
//         throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
//     }
// };
//
// /**
//  * Logout user
//  * @returns {Promise<void>}
//  */
// export const logout = async () => {
//     try {
//         // Call logout endpoint if needed
//         // await api.post('/auth/logout');
//
//         // Remove token from localStorage
//         localStorage.removeItem('token');
//     } catch (error) {
//         console.error('Logout error:', error);
//         // Still remove token even if API call fails
//         localStorage.removeItem('token');
//     }
// };
//
// /**
//  * Get current user data
//  * @returns {Promise<Object>} - User data
//  */
// export const getCurrentUser = async () => {
//     try {
//         const response = await api.get('/auth/me');
//         return response.data;
//     } catch (error) {
//         console.error('Get current user error:', error);
//         throw new Error(error.response?.data?.message || 'Failed to fetch user data.');
//     }
// };
//
// /**
//  * Update user profile
//  * @param {Object} userData - Updated user data
//  * @returns {Promise<Object>} - Updated user data
//  */
// export const updateProfile = async (userData) => {
//     try {
//         const response = await api.put('/auth/profile', userData);
//         return response.data;
//     } catch (error) {
//         console.error('Update profile error:', error);
//         throw new Error(error.response?.data?.message || 'Failed to update profile. Please try again.');
//     }
// };
//
// /**
//  * Request password reset
//  * @param {string} email - User email
//  * @returns {Promise<Object>} - Response data
//  */
// export const requestPasswordReset = async (email) => {
//     try {
//         const response = await api.post('/auth/reset-password', { email });
//         return response.data;
//     } catch (error) {
//         console.error('Password reset request error:', error);
//         throw new Error(error.response?.data?.message || 'Failed to request password reset. Please try again.');
//     }
// };
//
// /**
//  * Confirm password reset
//  * @param {string} token - Reset token
//  * @param {string} password - New password
//  * @returns {Promise<Object>} - Response data
//  */
// export const confirmPasswordReset = async (token, password) => {
//     try {
//         const response = await api.post('/auth/reset-password/confirm', { token, password });
//         return response.data;
//     } catch (error) {
//         console.error('Password reset confirmation error:', error);
//         throw new Error(error.response?.data?.message || 'Failed to reset password. Please try again.');
//     }
// };
//
// /**
//  * Check if user is authenticated
//  * @returns {boolean} - Authentication status
//  */
// export const isAuthenticated = () => {
//     return !!localStorage.getItem('token');
// };