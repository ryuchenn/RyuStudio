import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Env from '@/config/Env';

/**
 * Firebase Config (WEB)
 */
const firebaseConfig = {
  apiKey: Env.FIREBASE_AUTH_API_KEY,               // Firebase Auth Database API KEY
  authDomain: Env.FIREBASE_AUTH_AUTH_DOMAIN,       // Auth Domain
  projectId: Env.FIREBASE_AUTH_PROJECTID,          // ID
  storageBucket: Env.FIREBASE_AUTH_STORAGEBUCKET,  // Storage Bucket
  messagingSenderId: Env.FIREBASE_AUTH_MESSAGINGSENDERID,    // Messaging Sender ID
  appId: Env.FIREBASE_AUTH_APPID                   // App ID
};

// Init Firebase App
const authFirebaseApp = initializeApp(firebaseConfig);

export const authAuth = getAuth(authFirebaseApp);
export const authDb = getFirestore(authFirebaseApp);
export default authFirebaseApp;