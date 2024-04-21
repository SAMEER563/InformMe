// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fireblog-311ea.firebaseapp.com",
  projectId: "fireblog-311ea",
  storageBucket: "fireblog-311ea.appspot.com",
  messagingSenderId: "214479171370",
  appId: "1:214479171370:web:5c15aa10f23f2bd4877853"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);

