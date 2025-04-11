// src/services/firebaseService.js
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
    collection,
    query,
    where,
    getDocs,
    orderBy
} from 'firebase/firestore';
import { app, db, auth } from '../firebase/config';

// Setting persistent sessions
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Session persistence set successfully");
    })
    .catch((error) => {
        console.error("Error setting session persistence:", error);
    });

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's name
 * @returns {Promise} - Registration result data
 */
export const registerUser = async (email, password, name) => {
    console.log("Starting registration process in firebaseService:", { email, name });

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created successfully:", user.uid);

        // Update profile with name
        await updateProfile(user, { displayName: name });
        console.log("Profile updated with name:", name);

        // Send verification email (optional)
        try {
            await sendEmailVerification(user);
            console.log("Verification email sent");
        } catch (emailError) {
            console.warn("Failed to send verification email:", emailError);
            // Continue with the process even if email sending fails
        }

        // Create user document in Firestore
        try {
            const userData = {
                uid: user.uid,
                email,
                name,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: 'user',
            };

            // Try to create a document in Firestore without awaiting the result
            setDoc(doc(db, "users", user.uid), userData)
                .then(() => console.log("User document created in Firestore"))
                .catch(err => console.error("Error creating user document:", err));

            // Sign out the user to ensure a clean registration experience
            await signOut(auth);
            console.log("Automatically signed out after registration");

            return {
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                }
            };
        } catch (firestoreError) {
            console.error("Error creating user document:", firestoreError);

            // Sign out user even if Firestore operation fails
            await signOut(auth);
            console.log("Automatically signed out after registration (with Firestore error)");

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
 * Log in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - User data and JWT token
 */
export const loginUser = async (email, password) => {
    console.log("Starting login process in firebaseService:", { email });

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login successful:", user.uid);

        // Get JWT token
        const token = await user.getIdToken();
        console.log("Token obtained successfully");

        // Update last login (asynchronously to avoid delaying user response)
        updateDoc(doc(db, "users", user.uid), {
            lastLogin: new Date().toISOString()
        })
            .then(() => console.log("Last login updated"))
            .catch(error => console.warn("Failed to update last login:", error));

        // Get basic user data from Auth first
        const basicUserData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            emailVerified: user.emailVerified
        };

        // Try to get more data from Firestore asynchronously
        getDoc(doc(db, "users", user.uid))
            .then(userDoc => {
                if (userDoc.exists()) {
                    console.log("Additional user data obtained from Firestore");
                } else {
                    console.log("No additional user data in Firestore, creating new document");
                    // Create new document if it doesn't exist
                    setDoc(doc(db, "users", user.uid), {
                        ...basicUserData,
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString(),
                        role: 'user',
                    }).catch(err => console.error("Error creating missing user document:", err));
                }
            })
            .catch(error => console.warn("Error getting user data from Firestore:", error));

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
 * Log out the current user
 * @returns {Promise} - Confirmation of success
 */
export const logoutUser = async () => {
    try {
        console.log("Starting logout process");
        await signOut(auth);
        console.log("Logout successful");
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * Get the current user
 * @returns {Promise} - User data if exists
 */
export const getCurrentUser = async () => {
    return new Promise((resolve, reject) => {
        console.log("Starting to get current user");

        // Can check current user immediately before setting up listener
        const currentUser = auth.currentUser;
        console.log("Current user (before listener):", currentUser ? currentUser.uid : "not logged in");

        // If no current user, return null immediately
        if (!currentUser) {
            console.log("No user currently logged in");
            resolve(null);
            return;
        }

        // If there is a current user, try to get their data from Firestore
        try {
            getDoc(doc(db, "users", currentUser.uid))
                .then(userDoc => {
                    const userData = userDoc.exists() ? userDoc.data() : null;
                    console.log("Got user data from Firestore:", userData ? "success" : "no data");

                    // Even if there's no data in Firestore, return basic data
                    resolve({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName,
                        emailVerified: currentUser.emailVerified,
                        ...(userData || {})
                    });
                })
                .catch(error => {
                    console.error("Error getting user data from Firestore:", error);
                    // In case of error, return basic data
                    resolve({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName,
                        emailVerified: currentUser.emailVerified
                    });
                });
        } catch (error) {
            console.error("General error getting user data:", error);
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
 * Get user files from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of user files
 */
export const getUserFiles = async (userId) => {
    if (!userId) {
        console.log("No user ID provided for fetching files");
        return [];
    }

    try {
        const filesRef = collection(db, `users/${userId}/files`);
        const filesQuery = query(filesRef, orderBy('uploaded_at', 'desc'));
        const filesSnapshot = await getDocs(filesQuery);

        const files = filesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            uploaded_at: doc.data().uploaded_at?.toDate() || new Date()
        }));

        console.log(`Retrieved ${files.length} files for user ${userId}`);
        return files;
    } catch (error) {
        console.error("Error fetching user files:", error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {Object} userData - Data to update
 * @returns {Promise} - Updated user data
 */
export const updateUserProfile = async (userData) => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        // Update data in Firebase Authentication if name is changed
        if (userData.name) {
            await updateProfile(currentUser, { displayName: userData.name });
        }

        // Update data in Firestore
        const userRef = doc(db, "users", currentUser.uid);

        // Exclude sensitive data from update
        const { password, ...updatableData } = userData;

        await updateDoc(userRef, {
            ...updatableData,
            updatedAt: new Date().toISOString()
        });

        // Return updated data
        const updatedDoc = await getDoc(userRef);
        return updatedDoc.data();
    } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise} - Confirmation of email sent
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
 * Translate Firebase error codes to understandable messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} - Translated error message
 */
const translateFirebaseError = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already in use.',
        'auth/weak-password': 'Password is too weak, it must be at least 6 characters.',
        'auth/user-not-found': 'No account exists with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Access has been temporarily disabled due to many failed attempts. Please try again later.',
        'auth/operation-not-allowed': 'This operation is not allowed.',
        'auth/network-request-failed': 'Network failure. Please check your internet connection.',
        'auth/invalid-credential': 'Invalid credentials.',
        'auth/invalid-verification-code': 'Invalid verification code.',
        'auth/invalid-verification-id': 'Invalid verification ID.',
        'auth/captcha-check-failed': 'Captcha verification failed.',
        'auth/missing-verification-code': 'Verification code is missing.',
        'auth/missing-verification-id': 'Verification ID is missing.',
    };

    return errorMessages[errorCode] || null;
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    requestPasswordReset,
    getUserFiles
};