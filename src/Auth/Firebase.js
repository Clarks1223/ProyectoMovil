// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2TvYYpK_35FutTrzr1z2odkh-605xdVI",
  authDomain: "proyecto-geo-4caa1.firebaseapp.com",
  projectId: "proyecto-geo-4caa1",
  storageBucket: "proyecto-geo-4caa1.appspot.com",
  messagingSenderId: "817588884731",
  appId: "1:817588884731:web:d2cc680246d1a660d80c5e",
};
// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
export { fireBaseApp };
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(fireBaseApp);
export { auth };
//base de datos con tablas
const fireStore = getFirestore(fireBaseApp);
export { fireStore };
//Storage
const storage = getStorage(fireBaseApp);
export { storage };
//
// Inicializa Realtime Database
const database = getDatabase(fireBaseApp);
export { database };
