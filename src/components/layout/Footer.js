// src/components/layout/Footer.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import '../../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { darkMode } = useContext(ThemeContext);

    return (
        <footer className={`footer ${darkMode ? 'dark' : ''}`}>
            <div className="footer-wave">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fillOpacity="1" d="M0,288L48,282.7C96,277,192,267,288,229.3C384,192,480,128,576,117.3C672,107,768,149,864,181.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section logo-section">
                        <Link to="/" className="footer-logo">
                            <div className="footer-logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08c.58-.21 1-.8 1-1.42V12.5c0-.62-.42-1.21-1-1.42z"></path>
                                    <path d="M14 3v5h5"></path>
                                    <path d="M9 14h6"></path>
                                    <path d="M9 18h6"></path>
                                    <path d="M9 10h1"></path>
                                </svg>
                            </div>
                            <span className="footer-logo-text">NovaPDF</span>
                            <span className="footer-logo-premium">ELITE</span>
                        </Link>
                        <p className="footer-description">
                            Experience the future of PDF interaction. Advanced AI-powered document analysis and conversation.
                        </p>
                        <div className="footer-cta">
                            <Link to="/upgrade" className="footer-cta-button">
                                Try Elite Free
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="footer-section links-section">
                        <h3 className="footer-heading">Product</h3>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/features" className="footer-link">Features</Link></li>
                            <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                            <li><Link to="/testimonials" className="footer-link">Testimonials</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section links-section">
                        <h3 className="footer-heading">Resources</h3>
                        <ul className="footer-links">
                            <li><Link to="/docs" className="footer-link">Documentation</Link></li>
                            <li><Link to="/guides" className="footer-link">Guides</Link></li>
                            <li><Link to="/api" className="footer-link">API</Link></li>
                            <li><Link to="/blog" className="footer-link">Blog</Link></li>
                            <li><Link to="/changelog" className="footer-link">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section links-section">
                        <h3 className="footer-heading">Company</h3>
                        <ul className="footer-links">
                            <li><Link to="/about" className="footer-link">About</Link></li>
                            <li><Link to="/contact" className="footer-link">Contact</Link></li>
                            <li><Link to="/careers" className="footer-link">Careers</Link></li>
                            <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
                            <li><Link to="/terms" className="footer-link">Terms</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section newsletter-section">
                        <h3 className="footer-heading">Stay Updated</h3>
                        <p className="newsletter-text">Subscribe to our newsletter for the latest updates and features.</p>
                        <form className="newsletter-form">
                            <div className="newsletter-input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    aria-label="Email for newsletter"
                                />
                                <button type="submit" className="newsletter-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; {currentYear} NovaPDF Elite. All rights reserved.
                    </div>

                    <div className="social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;