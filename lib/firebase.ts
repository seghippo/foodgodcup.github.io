import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQwVVeTO-JaeGI2V1f_j3WNLrw9X-F03U",
    authDomain: "foodgodcup.firebaseapp.com",
    projectId: "foodgodcup",
    storageBucket: "foodgodcup.firebasestorage.app",
    messagingSenderId: "469524887680",
    appId: "1:469524887680:web:7927f46f364ee73b53ce65",
    measurementId: "G-ZNMR391CSW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators locally
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;
