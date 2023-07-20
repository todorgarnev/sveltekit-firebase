import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCXGlW0nrmhV_vIC8kCqKkGW0PzMhmTIpc",
	authDomain: "sveltekit-firebase-76195.firebaseapp.com",
	projectId: "sveltekit-firebase-76195",
	storageBucket: "sveltekit-firebase-76195.appspot.com",
	messagingSenderId: "507314545941",
	appId: "1:507314545941:web:26805dfdab245a6210751c",
	measurementId: "G-LTEKQSK0VF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
