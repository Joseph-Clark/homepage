// Replace these values with YOUR Firebase config from Step 1.3
const firebaseConfig = {
  apiKey: "YOUR-API-KEY-HERE",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Simple user ID (you can replace this with proper auth later)
let userId = localStorage.getItem('tennisCalendarUserId');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('tennisCalendarUserId', userId);
