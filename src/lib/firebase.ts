
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "savrii-ai-assistant",
  "appId": "1:478354757034:web:183eb0565e53fb421447d3",
  "storageBucket": "savrii-ai-assistant.firebasestorage.app",
  "apiKey": "AIzaSyBcfTgVyZ_p6n8BLdfDdJhlqKNQNrE5UXw",
  "authDomain": "savrii-ai-assistant.firebaseapp.com",
  "messagingSenderId": "478354757034"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
