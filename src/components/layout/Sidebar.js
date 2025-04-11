// src/components/layout/Sidebar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ chatHistory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode } = useContext(ThemeContext);
    const [hasData, setHasData] = useState(false);
    const location = useLocation();

    // Check if there's data to display
    useEffect(() => {
        setHasData(chatHistory && chatHistory.length > 0);
    }, [chatHistory]);

    // Handle close sidebar - direct implementation
    function handleCloseSidebar() {
        setIsOpen(false);
    }

    // Handle toggle sidebar
    function handleToggleSidebar() {
        setIsOpen(prevState => !prevState);
    }

    // Format date for display
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // If no data and no need to show sidebar, return minimal UI
    if (!hasData && !isOpen) {
        return (
            <button
                className={`premium-menu-btn ${darkMode ? 'dark' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Open documents menu"
            >
                <div className="menu-btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
                <span>Documents</span>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop/overlay */}
            <div
                className={`premium-sidebar-backdrop ${isOpen ? 'active' : ''}`}
                onClick={handleCloseSidebar}
            ></div>

            {/* Main sidebar */}
            <aside className={`premium-sidebar ${isOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}>
                <div className="premium-sidebar-header">
                    <div className="premium-sidebar-title">
                        <div className="title-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08c.58-.21 1-.8 1-1.42V12.5c0-.62-.42-1.21-1-1.42z"></path>
                                <path d="M14 3v5h5"></path>
                            </svg>
                        </div>
                        <h2>My Documents</h2>
                    </div>

                    {/* Close button - direct implementation */}
                    <button
                        className="premium-close-btn"
                        onClick={handleCloseSidebar}
                        aria-label="Close sidebar"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="premium-sidebar-search">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="premium-search-input"
                        />
                    </div>
                </div>

                <div className="premium-documents-list">
                    {hasData ? (
                        chatHistory.map((doc) => {
                            const isActive = location.pathname === `/chat/${doc.id}`;

                            return (
                                <Link
                                    to={`/chat/${doc.id}`}
                                    key={doc.id}
                                    className={`premium-document-item ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        // On mobile, close sidebar after selection
                                        if (window.innerWidth < 1024) {
                                            handleCloseSidebar();
                                        }
                                    }}
                                >
                                    <div className="document-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <line x1="10" y1="9" x2="8" y2="9"></line>
                                        </svg>
                                    </div>
                                    <div className="document-details">
                                        <h3 className="document-title">{doc.title || 'Untitled Document'}</h3>
                                        <p className="document-date">{formatDate(doc.date)}</p>
                                    </div>
                                    <div className="document-action">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="empty-documents">
                            <div className="empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <path d="M14 2v6h6"></path>
                                    <path d="M12 18v-6"></path>
                                    <path d="M9 15h6"></path>
                                </svg>
                            </div>
                            <h3>No Documents Yet</h3>
                            <p>Upload a PDF to start a conversation</p>
                            <button className="upload-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload PDF
                            </button>
                        </div>
                    )}
                </div>

                <div className="premium-sidebar-footer">
                    <div className="premium-branding">
                        <div className="brand-logo">
                            <div className="brand-logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08c.58-.21 1-.8 1-1.42V12.5c0-.62-.42-1.21-1-1.42z"></path>
                                    <path d="M14 3v5h5"></path>
                                    <path d="M9 14h6"></path>
                                    <path d="M9 18h6"></path>
                                    <path d="M9 10h1"></path>
                                </svg>
                            </div>
                            <div className="brand-text">
                                <div className="brand-name">NovaPDF</div>
                                <div className="brand-elite">ELITE</div>
                            </div>
                        </div>
                        <div className="brand-version">v2.1.0</div>
                    </div>
                </div>
            </aside>

            {/* Mobile toggle button */}
            {hasData && (
                <button
                    className={`premium-toggle-btn ${isOpen ? 'hidden' : ''} ${darkMode ? 'dark' : ''}`}
                    onClick={handleToggleSidebar}
                    aria-label="Open documents sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            )}
        </>
    );
};

export default Sidebar;