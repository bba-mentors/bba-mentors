import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore using the configured databaseId
export const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const firebaseInfo = {
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
  authDomain: firebaseConfig.authDomain,
  isConfigured: Boolean(firebaseConfig.projectId && firebaseConfig.apiKey),
};

// Re-export core Firestore & Auth primitives for clean imports across the app
export {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  type FirebaseUser,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
};
