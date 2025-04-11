// src/components/chat/ChatHistory.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';

const ChatHistory = ({ chatHistory }) => {
    const location = useLocation();
    const { darkMode } = useContext(ThemeContext);

    // If no history is provided, return nothing
    if (!chatHistory || chatHistory.length === 0) {
        return null;
    }

    // Format date for display
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    return (
        <div className="chat-history">
            {chatHistory.map((chat) => {
                const isActive = location.pathname === `/chat/${chat.id}`;

                return (
                    <Link
                        to={`/chat/${chat.id}`}
                        key={chat.id}
                        className={`chat-history-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="chat-title">
                            <svg
                                className="chat-title-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            {chat.title || 'Untitled Document'}
                        </div>
                        <div className="chat-date">
                            {formatDate(chat.date)}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default ChatHistory;