// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8VI8KT1xvtFi_Zotfw6LAyOHt71H70oQ",
  authDomain: "jobhub-d6673.firebaseapp.com",
  projectId: "jobhub-d6673",
  storageBucket: "jobhub-d6673.firebasestorage.app",
  messagingSenderId: "464451864847",
  appId: "1:464451864847:web:51de60c07ebad9e320167a",
  measurementId: "G-XKX294RCYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);