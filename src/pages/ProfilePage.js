// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { currentUser, updateProfile, loading, error, logout } = useAuth();
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // تحميل بيانات المستخدم الحالي
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('خطأ في تسجيل الخروج:', err);
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        // إعادة تعيين الرسائل وكلمات المرور عند تغيير الوضع
        setUpdateError('');
        setUpdateSuccess('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const validatePassword = (password) => {
        if (!password) return true; // لا داعي للتحقق إذا لم تكن هناك كلمة مرور جديدة
        // على الأقل 8 أحرف، وحرف كبير واحد على الأقل، وحرف صغير واحد على الأقل، ورقم واحد على الأقل
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateSuccess('');
        setIsUpdating(true);

        // التحقق من البيانات
        if (!name) {
            setUpdateError('الاسم مطلوب');
            setIsUpdating(false);
            return;
        }

        // إذا كان يتم تغيير كلمة المرور، فتحقق منها
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                setUpdateError('كلمات المرور غير متطابقة');
                setIsUpdating(false);
                return;
            }

            if (!validatePassword(newPassword)) {
                setUpdateError('كلمة المرور يجب أن تكون على الأقل 8 أحرف وتحتوي على حرف كبير وحرف صغير ورقم');
                setIsUpdating(false);
                return;
            }
        }

        try {
            // تحضير البيانات للتحديث
            const userData = { name };

            // تضمين كلمة المرور فقط إذا كان يتم تغييرها
            if (newPassword) {
                userData.password = newPassword;
            }

            // استدعاء وظيفة التحديث
            await updateProfile(userData);

            setUpdateSuccess('تم تحديث الملف الشخصي بنجاح');
            setIsEditing(false);

            // مسح حقول كلمة المرور
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setUpdateError(err.message || 'خطأ في تحديث الملف الشخصي');
        } finally {
            setIsUpdating(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>الملف الشخصي</h1>
                    <p>إدارة المعلومات الشخصية وإعدادات الحساب</p>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="user-info">
                            <h2>{currentUser?.name || 'المستخدم'}</h2>
                            <p>{currentUser?.email || 'user@example.com'}</p>
                            {currentUser?.role && (
                                <span className="user-role">{currentUser.role}</span>
                            )}
                        </div>
                    </div>

                    {updateSuccess && (
                        <div className="profile-success">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>{updateSuccess}</span>
                        </div>
                    )}

                    {updateError && (
                        <div className="profile-error">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{updateError}</span>
                        </div>
                    )}

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">الاسم</label>
                                <div className="input-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="ادخل اسمك"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">البريد الإلكتروني</label>
                                <div className="input-wrapper disabled">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="input-hint">
                                    لا يمكن تغيير البريد الإلكتروني
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">كلمة المرور الجديدة (اختياري)</label>
                                <div className="input-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="اترك فارغًا إذا لم ترغب في التغيير"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={togglePasswordVisibility}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="password-requirements">
                                    كلمة المرور يجب أن تكون على الأقل 8 أحرف وتحتوي على حرف كبير وحرف صغير ورقم
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</label>
                                <div className="input-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="أعد إدخال كلمة المرور الجديدة"
                                    />
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={toggleEditing}
                                    disabled={isUpdating}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="spinner"></span>
                                            جارٍ الحفظ...
                                        </>
                                    ) : (
                                        'حفظ التغييرات'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <div className="profile-item">
                                <div className="item-label">الاسم</div>
                                <div className="item-value">{currentUser?.name || 'غير محدد'}</div>
                            </div>

                            <div className="profile-item">
                                <div className="item-label">البريد الإلكتروني</div>
                                <div className="item-value">{currentUser?.email || 'غير محدد'}</div>
                            </div>

                            <div className="profile-item">
                                <div className="item-label">حالة الحساب</div>
                                <div className="item-value">
                                    {currentUser?.emailVerified ? (
                                        <span className="verified-badge">تم التحقق</span>
                                    ) : (
                                        <span className="unverified-badge">لم يتم التحقق</span>
                                    )}
                                </div>
                            </div>

                            <div className="profile-item">
                                <div className="item-label">تاريخ الانضمام</div>
                                <div className="item-value">
                                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('ar-SA') : 'غير متاح'}
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={toggleEditing}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    تعديل الملف الشخصي
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-card security-section">
                    <h2>الأمان</h2>
                    <div className="security-actions">
                        <button className="logout-button" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;