import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAgh5KbXVneWZ5ws3beJ5tracTj4bzIdOQ",
  authDomain: "notesapp-15cbb.firebaseapp.com",
  projectId: "notesapp-15cbb",
  storageBucket: "notesapp-15cbb.firebasestorage.app",
  messagingSenderId: "1070945862486",
  appId: "1:1070945862486:web:4f99865f0cef2e071bccf7",
  measurementId: "G-6CTL8RW316"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
