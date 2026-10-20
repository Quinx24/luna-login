import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhTUnAjBq7vzq1GvYKxTG5jMXz55ojsEY",
  authDomain: "luna-c3837.firebaseapp.com",
  projectId: "luna-c3837",
  storageBucket: "luna-c3837.firebasestorage.app",
  messagingSenderId: "727758358381",
  appId: "1:727758358381:web:66ac796cc10e39e9ebfc64",
  measurementId: "G-BJWZTV5WXE",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');