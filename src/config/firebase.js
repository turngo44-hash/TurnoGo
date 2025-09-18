// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import envConfig from './env';

// Your web app's Firebase configuration from environment variables
const firebaseConfig = envConfig.getFirebaseConfig();

// Initialize Firebase app only if it hasn't been initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // Si ya está inicializado, usar getAuth
  if (error.code === 'auth/already-initialized') {
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Cloud Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
