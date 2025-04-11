// src/contexts/ChatContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = useState([
        {
            id: '1',
            title: 'Annual Report 2024.pdf',
            date: '2025-04-05T12:30:00Z',
        },
        {
            id: '2',
            title: 'Financial Analysis Q1.pdf',
            date: '2025-04-03T09:15:00Z',
        },
        {
            id: '3',
            title: 'Project Proposal.pdf',
            date: '2025-03-28T15:45:00Z',
        }
    ]);

    return (
        <ChatContext.Provider value={{ chatHistory, setChatHistory }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);