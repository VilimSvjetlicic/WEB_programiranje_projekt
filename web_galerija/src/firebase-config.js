import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBhY9wkkBdN-zxRrVI1aHdIRBiRDKIlAlc",
  authDomain: "fir-proba-5605f.firebaseapp.com",
  projectId: "fir-proba-5605f",
  storageBucket: "fir-proba-5605f.appspot.com",
  messagingSenderId: "1094006332247",
  appId: "1:1094006332247:web:b167b62b7a3a6191ad3c12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);    