// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'ads-network-23e78.firebaseapp.com',
  projectId: 'ads-network-23e78',
  storageBucket: 'ads-network-23e78.appspot.com',
  messagingSenderId: '488926789072',
  appId: '1:488926789072:web:1351d450be4420d2840dd5',
  databaseURL: "https://ads-network-23e78.firebaseio.com",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
