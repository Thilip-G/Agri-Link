import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAYBOo9KRjZHhhqZm9rse7gphmjJ7_Mxxg",
  authDomain: "agrilink-26c97.firebaseapp.com",
  projectId: "agrilink-26c97",
  storageBucket: "agrilink-26c97.firebasestorage.app",
  messagingSenderId: "77951879851",
  appId: "1:77951879851:web:33496be8a1231c91bdc5ee",
  measurementId: "G-90VT3NW8J4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

