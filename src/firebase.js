import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDov_SCbXU4HJZA04hyKRP8ExeDup7cxRg",
  authDomain: "playsummer-15c20.firebaseapp.com",
  projectId: "playsummer-15c20",
  storageBucket: "playsummer-15c20.firebasestorage.app",
  messagingSenderId: "411723190988",
  appId: "1:411723190988:web:55e766c042b07c3a0e2869",
  measurementId: "G-D7GQEMXLYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { db, storage };