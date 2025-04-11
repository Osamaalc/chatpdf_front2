// src/pages/ForgotPasswordPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AuthPages.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { darkMode } = useContext(ThemeContext);
    const { requestReset } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني');
            setIsLoading(false);
            return;
        }

        try {
            await requestReset(email);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // عرض رسالة نجاح بعد الإرسال
    if (isSubmitted) {
        return (
            <div className={`auth-page ${darkMode ? 'dark' : ''}`}>
                <div className="auth-container">
                    <div className="auth-header">
                        <div className="logo">
                            <div className="logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08c.58-.21 1-.8 1-1.42V12.5c0-.62-.42-1.21-1-1.42z"></path>
                                    <path d="M14 3v5h5"></path>
                                    <path d="M9 14h6"></path>
                                    <path d="M9 18h6"></path>
                                    <path d="M9 10h1"></path>
                                </svg>
                            </div>
                            <span className="logo-text">NovaPDF</span>
                            <span className="logo-premium">ELITE</span>
                        </div>
                        <h1>تم إرسال رابط إعادة تعيين كلمة المرور</h1>
                    </div>

                    <div className="success-message">
                        <div className="success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني <strong>{email}</strong>. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة المرور.</p>
                        <div className="auth-actions">
                            <Link to="/login" className="auth-button">
                                العودة إلى تسجيل الدخول
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`auth-page ${darkMode ? 'dark' : ''}`}>
            <div className="auth-container">
                <div className="auth-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-3.08c.58-.21 1-.8 1-1.42V12.5c0-.62-.42-1.21-1-1.42z"></path>
                                <path d="M14 3v5h5"></path>
                                <path d="M9 14h6"></path>
                                <path d="M9 18h6"></path>
                                <path d="M9 10h1"></path>
                            </svg>
                        </div>
                        <span className="logo-text">NovaPDF</span>
                        <span className="logo-premium">ELITE</span>
                    </div>
                    <h1>استعادة كلمة المرور</h1>
                    <p>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <div className="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="أدخل بريدك الإلكتروني"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                جارٍ الإرسال...
                            </>
                        ) : (
                            'إرسال رابط إعادة التعيين'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p><Link to="/login">العودة إلى تسجيل الدخول</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;