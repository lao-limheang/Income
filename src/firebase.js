// src/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-pT0gkyo_Ay7XOrnPoVcAJyD7ZnLw-z8",
  authDomain: "checkin-chafe.firebaseapp.com",
  projectId: "checkin-chafe",
  storageBucket: "checkin-chafe.firebasestorage.app",
  messagingSenderId: "1087154606159",
  appId: "1:1087154606159:web:473aaf686512be8a72da3a",
  measurementId: "G-VXL6D96DFT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
