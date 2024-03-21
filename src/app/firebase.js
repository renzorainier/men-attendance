import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4405_6ltwEKHeCv63Qiu609swEYi4DRg",
    authDomain: "attendance-9db46.firebaseapp.com",
    projectId: "attendance-9db46",
    storageBucket: "attendance-9db46.appspot.com",
    messagingSenderId: "426866363924",
    appId: "1:426866363924:web:52bae6d32f1e168b252101"
    };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
