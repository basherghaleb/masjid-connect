import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAewJYVJD5q5MvBVgoVh9vTQ2Fai5z5DnQ",
  authDomain: "masjidconnect-45136.firebaseapp.com",
  projectId: "masjidconnect-45136",
  storageBucket: "masjidconnect-45136.firebasestorage.app",
  messagingSenderId: "40801433314",
  appId: "1:40801433314:web:5384ee0ea38d0b40b150bb",
  measurementId: "G-7YVZG9SFSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and export it if supported
export const messaging = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(app);
    }
    return null;
  } catch (err) {
    console.log('Firebase messaging not supported');
    return null;
  }
};

export default app; 