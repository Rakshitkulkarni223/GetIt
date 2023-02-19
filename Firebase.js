import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyBJGV363J9OL1upLK9Yzy_O51y4zW6vEBc",
    authDomain: "getit-d33e8.firebaseapp.com",
    projectId: "getit-d33e8",
    storageBucket: "getit-d33e8.appspot.com",
    messagingSenderId: "743125169064",
    appId: "1:743125169064:web:916527cda83a13846d639d",
    measurementId: "G-T3R9HT5PRS"
};

const app = initializeApp(firebaseConfig);
export default app;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
export const database = getDatabase();
export const admins = ["rakshitkulkarni2002@gmail.com","+9193g80682856"]