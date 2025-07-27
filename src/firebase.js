// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD3V-rBT5YpXnwTGRTXA9zv2_kjRQ2irY",
  authDomain: "attendence-system-4c47f.firebaseapp.com",
  projectId: "attendence-system-4c47f",
  storageBucket: "attendence-system-4c47f.firebasestorage.app",
  messagingSenderId: "696141940277",
  appId: "1:696141940277:web:c0f31fd09268d37aa5937c",
  measurementId: "G-3CWKMZ6WNX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
