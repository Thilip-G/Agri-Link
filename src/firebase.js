// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCOyRfsJMaPLKinXVBUEs0BwWwZrdLswlg",
  authDomain: "agrilink-b5b9e.firebaseapp.com",
  projectId: "agrilink-b5b9e",
  storageBucket: "agrilink-b5b9e.firebasestorage.app",
  messagingSenderId: "179672675365",
  appId: "1:179672675365:web:428e8943f70bdce880bbcc",
  measurementId: "G-CE6LCCJ37N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


