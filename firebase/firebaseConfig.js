import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCigdYCP8mCDufP2lOoUc7CPz_7ZO8nFgE",
    authDomain: "solutions-78eb9.firebaseapp.com",
    projectId: "solutions-78eb9",
    storageBucket: "solutions-78eb9.appspot.com",
    messagingSenderId: "1036591175453",
    appId: "1:1036591175453:web:a004eca7952aff2127b3f4",
    measurementId: "G-QFPMT2R8BY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };