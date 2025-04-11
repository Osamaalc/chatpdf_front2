// // src/services/chatService.js
// import api from './api';
//
// /**
//  * Get list of chat sessions
//  * @returns {Promise<Array>} - Array of chat sessions
//  */
// export const getChatHistory = async () => {
//     try {
//         const response = await api.get('/chats');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching chat history:', error);
//         throw new Error(error.response?.data?.message || 'Failed to fetch chat history. Please try again.');
//     }
// };
//
// /**
//  * Get messages for a specific chat
//  * @param {string} chatId - ID of the chat
//  * @returns {Promise<Object>} - Chat data with messages
//  */
// export const getChatMessages = async (chatId) => {
//     try {
//         const response = await api.get(`/chats/${chatId}`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching messages for chat ${chatId}:`, error);
//         throw new Error(error.response?.data?.message || 'Failed to fetch chat messages. Please try again.');
//     }
// };
//
// /**
//  * Send a message in a chat
//  * @param {string} chatId - ID of the chat
//  * @param {string} content - Message content
//  * @returns {Promise<Object>} - The created message
//  */
// export const sendMessage = async (chatId, content) => {
//     try {
//         const response = await api.post(`/chats/${chatId}/messages`, { content });
//         return response.data;
//     } catch (error) {
//         console.error(`Error sending message in chat ${chatId}:`, error);
//         throw new Error(error.response?.data?.message || 'Failed to send message. Please try again.');
//     }
// };
//
// /**
//  * Create a new chat session
//  * @param {string} pdfId - ID of the PDF document
//  * @param {string} fileName - Name of the PDF file
//  * @returns {Promise<Object>} - The created chat session
//  */
// export const createChat = async (pdfId, fileName) => {
//     try {
//         const response = await api.post('/chats', { pdfId, fileName });
//         return response.data;
//     } catch (error) {
//         console.error('Error creating chat session:', error);
//         throw new Error(error.response?.data?.message || 'Failed to create chat session. Please try again.');
//     }
// };
//
// /**
//  * Delete a chat session
//  * @param {string} chatId - ID of the chat to delete
//  * @returns {Promise<Object>} - Response data
//  */
// export const deleteChat = async (chatId) => {
//     try {
//         const response = await api.delete(`/chats/${chatId}`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error deleting chat ${chatId}:`, error);
//         throw new Error(error.response?.data?.message || 'Failed to delete chat. Please try again.');
//     }
// };
//
// /**
//  * Rename a chat session
//  * @param {string} chatId - ID of the chat
//  * @param {string} newName - New name for the chat
//  * @returns {Promise<Object>} - Updated chat data
//  */
// export const renameChat = async (chatId, newName) => {
//     try {
//         const response = await api.patch(`/chats/${chatId}`, { name: newName });
//         return response.data;
//     } catch (error) {
//         console.error(`Error renaming chat ${chatId}:`, error);
//         throw new Error(error.response?.data?.message || 'Failed to rename chat. Please try again.');
//     }
// };
//
// /**
//  * Get PDF preview for a chat
//  * @param {string} chatId - ID of the chat
//  * @returns {Promise<Object>} - PDF data associated with the chat
//  */
// export const getChatPDF = async (chatId) => {
//     try {
//         const response = await api.get(`/chats/${chatId}/pdf`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching PDF for chat ${chatId}:`, error);
//         throw new Error(error.response?.data?.message || 'Failed to fetch PDF. Please try again.');
//     }
// };