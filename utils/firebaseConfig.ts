// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4NEvOyPhS76jfE0Q6AArCh6fSbqIeWTQ",
  authDomain: "shop-plan-c5eb5.firebaseapp.com",
  projectId: "shop-plan-c5eb5",
  storageBucket: "shop-plan-c5eb5.firebasestorage.app",
  messagingSenderId: "729367066840",
  appId: "1:729367066840:web:28a235354b51e538cc3fad",
  measurementId: "G-G5GL6VZNJK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
