// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "fireblog-311ea.firebaseapp.com",
//   projectId: "fireblog-311ea",
//   storageBucket: "fireblog-311ea.appspot.com",
//   messagingSenderId: "214479171370",
//   appId: "1:214479171370:web:5c15aa10f23f2bd4877853"
// };

// // Initialize Firebase
//  export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCctmaly-saNebfMKhseFZkbOJBaHb2YTw",
  authDomain: "informme-13604.firebaseapp.com",
  projectId: "informme-13604",
  storageBucket: "informme-13604.firebasestorage.app",
  messagingSenderId: "607143545296",
  appId: "1:607143545296:web:da41ae15ea7ef23992d1d5",
  measurementId: "G-3EN3QN1ECF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

