// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArvdxauwjBtUdnhlp8tqGISK7AxfAzpeg",
    authDomain: "chatpdf-9b3cf.firebaseapp.com",
    projectId: "chatpdf-9b3cf",
    storageBucket: "chatpdf-9b3cf.firebasestorage.app",
    messagingSenderId: "832708294441",
    appId: "1:832708294441:web:8c2d7397ec26142af8e938",
    measurementId: "G-ZJDNFNZYL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { app, db, auth, analytics };