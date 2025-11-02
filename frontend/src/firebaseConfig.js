// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrU-kH6Igaa4n0a9snoHLXIbI4IgD3kek",
  authDomain: "movie-review-platform-c3801.firebaseapp.com",
  projectId: "movie-review-platform-c3801",
  storageBucket: "movie-review-platform-c3801.firebasestorage.app",
  messagingSenderId: "732717225187",
  appId: "1:732717225187:web:a03339b6d0f3f1c7ca21d6",
  measurementId: "G-KMJDJ8H03E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);