// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useChat = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);

    // Fetch chat history on component mount
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setLoading(true);
                const response = await api.get('/chats');
                setChatHistory(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching chat history:', err);
                setError('Failed to load chat history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();
    }, []);

    // Function to load a specific chat
    const loadChat = async (chatId) => {
        try {
            setLoading(true);
            const response = await api.get(`/chats/${chatId}`);
            setCurrentChat(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            console.error(`Error loading chat ${chatId}:`, err);
            setError('Failed to load chat. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to send a message in the current chat
    const sendMessage = async (chatId, message) => {
        try {
            setLoading(true);
            const response = await api.post(`/chats/${chatId}/messages`, { content: message });

            // Update current chat with the new message
            if (currentChat && currentChat.id === chatId) {
                setCurrentChat(prev => ({
                    ...prev,
                    messages: [...prev.messages, response.data]
                }));
            }

            // Update the chat in the history with the latest message
            setChatHistory(prev =>
                prev.map(chat =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            lastMessage: message,
                            updatedAt: new Date().toISOString()
                        }
                        : chat
                )
            );

            setError(null);
            return response.data;
        } catch (err) {
            console.error(`Error sending message in chat ${chatId}:`, err);
            setError('Failed to send message. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to create a new chat
    const createChat = async (pdfId, fileName) => {
        try {
            setLoading(true);
            const response = await api.post('/chats', { pdfId, fileName });

            // Add the new chat to the history
            setChatHistory(prev => [response.data, ...prev]);

            setError(null);
            return response.data;
        } catch (err) {
            console.error('Error creating new chat:', err);
            setError('Failed to create new chat. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a chat
    const deleteChat = async (chatId) => {
        try {
            setLoading(true);
            await api.delete(`/chats/${chatId}`);

            // Remove the chat from the history
            setChatHistory(prev => prev.filter(chat => chat.id !== chatId));

            // Reset current chat if it was the one deleted
            if (currentChat && currentChat.id === chatId) {
                setCurrentChat(null);
            }

            setError(null);
        } catch (err) {
            console.error(`Error deleting chat ${chatId}:`, err);
            setError('Failed to delete chat. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        chatHistory,
        currentChat,
        loading,
        error,
        loadChat,
        sendMessage,
        createChat,
        deleteChat
    };
};

export default useChat;