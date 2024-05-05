import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDeh6qa1z3ZGJGTSc-Ns2BBhcSH9xjAKWs",
    authDomain: "chat-application-c7e52.firebaseapp.com",
    projectId: "chat-application-c7e52",
    storageBucket: "chat-application-c7e52.appspot.com",
    messagingSenderId: "996214901988",
    appId: "1:996214901988:web:df4c03279df27fc2f070f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();