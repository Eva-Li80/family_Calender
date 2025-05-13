import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY_CALENDER,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN_CALENDER,
  projectId: import.meta.env.VITE_PROJECT_ID_CALENDER,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET_CALENDER,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID_CALENDER,
  appId: import.meta.env.VITE_APP_ID_CALENDER,
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
