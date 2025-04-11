// src/components/MessageBubble/MessageBubble.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    // Format timestamp to display only the time (HH:MM)
    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className={`message-bubble ${isUser ? 'user-message' : 'ai-message'}`}>
            <div className="message-avatar">
                {isUser ? (
                    <div className="user-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                ) : (
                    <div className="ai-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>
                )}
            </div>

            <div className="message-content">
                <div className="message-sender">
                    {isUser ? 'You' : 'AI Assistant'}
                </div>
                <div className="message-text">
                    {/* Use ReactMarkdown for AI messages and regular text for user messages */}
                    {isUser ? (
                        <p>{message.text}</p>
                    ) : (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                </div>
                <div className="message-time">
                    {formatTime(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;