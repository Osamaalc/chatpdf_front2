// src/components/FileSidebar/FileSidebar.jsx
import React from 'react';
import './FileSidebar.css';

const FileSidebar = ({ files, isLoading, selectedFile, onSelectFile }) => {
    // Format date to display in a readable format
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="file-sidebar">
            <div className="sidebar-header">
                <h2>Your Documents</h2>
            </div>

            <div className="sidebar-content">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your files...</p>
                    </div>
                ) : files.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <p>No documents found</p>
                        <p className="empty-subtitle">Upload documents to start a conversation</p>
                    </div>
                ) : (
                    <ul className="file-list">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className={`file-item ${selectedFile?.id === file.id ? 'active' : ''}`}
                                onClick={() => onSelectFile(file)}
                            >
                                <div className="file-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <div className="file-details">
                                    <h3 className="file-name">{file.file_name}</h3>
                                    <p className="file-date">{formatDate(file.uploaded_at)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FileSidebar;