// Replace these values with YOUR Firebase config from Step 1.3
  const firebaseConfig = {
    apiKey: "AIzaSyCs9vGZz6_7WByc43i9rG3DTXNYZ1z_XgM",
    authDomain: "tennis-cal.firebaseapp.com",
    projectId: "tennis-cal",
    storageBucket: "tennis-cal.firebasestorage.app",
    messagingSenderId: "1080538425304",
    appId: "1:1080538425304:web:c5eacdefc27d2bca72b4ad"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// FIXED DOCUMENT ID - Everyone uses the same one!
const CALENDAR_DOC_ID = 'tennis-calendar-cycle-2';

// Debug: verify it loaded
console.log('✅ Firebase config loaded');
console.log('✅ db is defined:', typeof db !== 'undefined');
console.log('✅ userId:', userId);

