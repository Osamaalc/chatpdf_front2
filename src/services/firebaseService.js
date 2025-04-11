// src/services/firebaseService.js
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';

// تكوين Firebase - يجب استبداله بإعدادات مشروعك الخاص
const firebaseConfig = {
    apiKey: "AIzaSyArvdxauwjBtUdnhlp8tqGISK7AxfAzpeg",
    authDomain: "chatpdf-9b3cf.firebaseapp.com",
    projectId: "chatpdf-9b3cf",
    storageBucket: "chatpdf-9b3cf.appspot.com", // تم تصحيح قيمة storageBucket
    messagingSenderId: "832708294441",
    appId: "1:832708294441:web:8c2d7397ec26142af8e938",
    measurementId: "G-ZJDNFNZYL5"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// تعيين استمرارية الجلسة
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("تم تعيين استمرارية الجلسة بنجاح");
    })
    .catch((error) => {
        console.error("خطأ في تعيين استمرارية الجلسة:", error);
    });

/**
 * إنشاء حساب مستخدم جديد
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} password - كلمة المرور
 * @param {string} name - اسم المستخدم
 * @returns {Promise} - البيانات الناتجة عن التسجيل
 */
export const registerUser = async (email, password, name) => {
    console.log("بدء عملية التسجيل في firebaseService:", { email, name });

    try {
        // إنشاء المستخدم مع Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("تم إنشاء المستخدم بنجاح:", user.uid);

        // تحديث الملف الشخصي مع الاسم
        await updateProfile(user, { displayName: name });
        console.log("تم تحديث الملف الشخصي مع الاسم:", name);

        // إرسال بريد تأكيد (اختياري)
        try {
            await sendEmailVerification(user);
            console.log("تم إرسال بريد التحقق");
        } catch (emailError) {
            console.warn("لم يتم إرسال بريد التحقق:", emailError);
            // نستمر بالعملية حتى لو فشل إرسال البريد
        }

        // إنشاء وثيقة المستخدم في Firestore
        try {
            const userData = {
                uid: user.uid,
                email,
                name,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: 'user',
            };

            // تحاول إنشاء وثيقة في Firestore ولكن لا تنتظر النتيجة
            setDoc(doc(db, "users", user.uid), userData)
                .then(() => console.log("تم إنشاء وثيقة المستخدم في Firestore"))
                .catch(err => console.error("خطأ في إنشاء وثيقة المستخدم:", err));

            // تسجيل خروج المستخدم لضمان تجربة نظيفة للتسجيل
            await signOut(auth);
            console.log("تم تسجيل الخروج تلقائيًا بعد التسجيل");

            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                }
            };
        } catch (firestoreError) {
            console.error("خطأ في إنشاء وثيقة المستخدم:", firestoreError);

            // تسجيل خروج المستخدم حتى إذا فشلت عملية Firestore
            await signOut(auth);
            console.log("تم تسجيل الخروج تلقائيًا بعد التسجيل (مع خطأ في Firestore)");

            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                }
            };
        }
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * تسجيل دخول المستخدم
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} password - كلمة المرور
 * @returns {Promise} - بيانات المستخدم وتوكن JWT
 */
export const loginUser = async (email, password) => {
    console.log("بدء عملية تسجيل الدخول في firebaseService:", { email });

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("تم تسجيل الدخول بنجاح:", user.uid);

        // الحصول على JWT token
        const token = await user.getIdToken();
        console.log("تم الحصول على token بنجاح");

        // تحديث آخر تسجيل دخول (غير متزامن لتجنب تأخير استجابة المستخدم)
        updateDoc(doc(db, "users", user.uid), {
            lastLogin: new Date().toISOString()
        })
            .then(() => console.log("تم تحديث آخر تسجيل دخول"))
            .catch(error => console.warn("تعذر تحديث آخر تسجيل دخول:", error));

        // تحاول الحصول على بيانات المستخدم من Firestore ولكن ترجع البيانات الأساسية أولاً
        const basicUserData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            emailVerified: user.emailVerified
        };

        // محاولة الحصول على المزيد من البيانات من Firestore بشكل غير متزامن
        getDoc(doc(db, "users", user.uid))
            .then(userDoc => {
                if (userDoc.exists()) {
                    console.log("تم الحصول على بيانات إضافية للمستخدم من Firestore");
                } else {
                    console.log("لا توجد بيانات إضافية للمستخدم في Firestore، سيتم إنشاء وثيقة جديدة");
                    // إنشاء وثيقة جديدة إذا لم تكن موجودة
                    setDoc(doc(db, "users", user.uid), {
                        ...basicUserData,
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString(),
                        role: 'user',
                    }).catch(err => console.error("خطأ في إنشاء وثيقة المستخدم الناقصة:", err));
                }
            })
            .catch(error => console.warn("خطأ في الحصول على بيانات المستخدم من Firestore:", error));

        return {
            user: basicUserData,
            token
        };
    } catch (error) {
        console.error("Error logging in:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * تسجيل خروج المستخدم
 * @returns {Promise} - تأكيد نجاح العملية
 */
export const logoutUser = async () => {
    try {
        console.log("بدء عملية تسجيل الخروج");
        await signOut(auth);
        console.log("تم تسجيل الخروج بنجاح");
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * الحصول على المستخدم الحالي
 * @returns {Promise} - بيانات المستخدم إن وجد
 */
export const getCurrentUser = async () => {
    return new Promise((resolve, reject) => {
        console.log("بدء الحصول على المستخدم الحالي");

        // يمكن التحقق فوراً من المستخدم الحالي قبل إعداد المستمع
        const currentUser = auth.currentUser;
        console.log("المستخدم الحالي (قبل المستمع):", currentUser ? currentUser.uid : "غير مسجل");

        // إذا لم يكن هناك مستخدم حالي، نعيد null فوراً
        if (!currentUser) {
            console.log("لا يوجد مستخدم مسجل حاليًا");
            resolve(null);
            return;
        }

        // إذا كان هناك مستخدم حالي، نحاول الحصول على بياناته من Firestore
        try {
            getDoc(doc(db, "users", currentUser.uid))
                .then(userDoc => {
                    const userData = userDoc.exists() ? userDoc.data() : null;
                    console.log("تم الحصول على بيانات المستخدم من Firestore:", userData ? "نجاح" : "لا توجد بيانات");

                    // حتى إذا لم تكن هناك بيانات في Firestore، نرجع البيانات الأساسية
                    resolve({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName,
                        emailVerified: currentUser.emailVerified,
                        ...(userData || {})
                    });
                })
                .catch(error => {
                    console.error("خطأ في الحصول على بيانات المستخدم من Firestore:", error);
                    // في حالة الخطأ، نرجع البيانات الأساسية
                    resolve({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName,
                        emailVerified: currentUser.emailVerified
                    });
                });
        } catch (error) {
            console.error("خطأ عام في الحصول على بيانات المستخدم:", error);
            resolve({
                uid: currentUser.uid,
                email: currentUser.email,
                name: currentUser.displayName,
                emailVerified: currentUser.emailVerified
            });
        }
    });
};

/**
 * تحديث ملف المستخدم الشخصي
 * @param {Object} userData - البيانات المراد تحديثها
 * @returns {Promise} - البيانات المحدثة للمستخدم
 */
export const updateUserProfile = async (userData) => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        // تحديث البيانات في Firebase Authentication إذا كان هناك تغيير في الاسم
        if (userData.name) {
            await updateProfile(currentUser, { displayName: userData.name });
        }

        // تحديث البيانات في Firestore
        const userRef = doc(db, "users", currentUser.uid);

        // استبعاد البيانات الحساسة من التحديث
        const { password, ...updatableData } = userData;

        await updateDoc(userRef, {
            ...updatableData,
            updatedAt: new Date().toISOString()
        });

        // إعادة البيانات المحدثة
        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * طلب إعادة تعيين كلمة المرور
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @returns {Promise} - تأكيد إرسال البريد
 */
export const requestPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Password reset email sent" };
    } catch (error) {
        console.error("Error sending password reset:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * ترجمة أكواد أخطاء Firebase إلى رسائل مفهومة
 * @param {string} errorCode - كود الخطأ من Firebase
 * @returns {string} - رسالة الخطأ المترجمة
 */
const translateFirebaseError = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل.',
        'auth/weak-password': 'كلمة المرور ضعيفة جدًا، يجب أن تكون على الأقل 6 أحرف.',
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني.',
        'auth/wrong-password': 'كلمة المرور غير صحيحة.',
        'auth/invalid-email': 'البريد الإلكتروني غير صالح.',
        'auth/user-disabled': 'تم تعطيل هذا الحساب.',
        'auth/too-many-requests': 'تم تقييد الوصول بسبب محاولات متكررة. يرجى المحاولة لاحقًا.',
        'auth/operation-not-allowed': 'هذه العملية غير مسموح بها.',
        'auth/network-request-failed': 'فشل في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
        'auth/invalid-credential': 'بيانات الاعتماد غير صالحة.',
        'auth/invalid-verification-code': 'رمز التحقق غير صالح.',
        'auth/invalid-verification-id': 'معرف التحقق غير صالح.',
        'auth/captcha-check-failed': 'فشل في التحقق من captcha.',
        'auth/missing-verification-code': 'رمز التحقق مفقود.',
        'auth/missing-verification-id': 'معرف التحقق مفقود.',
    };

    return errorMessages[errorCode] || null;
};

// تصدير الكائنات
export const firebaseAuth = auth;
export const firebaseFirestore = db;

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    requestPasswordReset,
    firebaseAuth,
    firebaseFirestore
};