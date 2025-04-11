// src/components/ChatWindow/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import ChatInput from '../ChatInput/ChatInput';
import MessageBubble from '../MessageBubble/MessageBubble';
import './ChatWindow.css';

const ChatWindow = ({ messages, isLoading, selectedFile, onSendMessage }) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-window">
            {selectedFile ? (
                <>
                    <div className="chat-header">
                        <h2>{selectedFile.file_name}</h2>
                    </div>

                    <div className="messages-container">
                        {messages.length === 0 && !isLoading ? (
                            <div className="empty-chat">
                                <div className="empty-chat-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <h3>Start a conversation</h3>
                                <p>Ask questions about your document</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                    />
                                ))}

                                {isLoading && (
                                    <div className="loading-message">
                                        <div className="loading-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
                </>
            ) : (
                <div className="no-file-selected">
                    <div className="no-file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <h2>No document selected</h2>
                    <p>Please select a document from the sidebar to start a conversation</p>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;