import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC-WsblUXaWjsvXqhf-XSAzLXqE1QhLUls",
  authDomain: "qrapp-d21d9.firebaseapp.com",
  projectId: "qrapp-d21d9",
  storageBucket: "qrapp-d21d9.appspot.com",
  messagingSenderId: "1012069800391",
  appId: "1:1012069800391:web:2559502499f18ef71d61e2",
  measurementId: "G-CDK5HPSLKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db };