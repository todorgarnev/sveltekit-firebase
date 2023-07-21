import { writable, type Readable, derived } from "svelte/store";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
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

const userStore = () => {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn("Auth is not initialized or not in browser");
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		subscribe
	};
};

export const user = userStore();

export function docStore<T>(path: string) {
	let unsubscribe: () => void;

	const docRef = doc(db, path);

	const { subscribe } = writable<T | null>(null, (set) => {
		unsubscribe = onSnapshot(docRef, (snapshot) => {
			set((snapshot.data() as T) ?? null);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: docRef,
		id: docRef.id
	};
}

interface Link {
	icon: string;
	title: string;
	url: string;
}

interface UserData {
	username: string;
	bio: string;
	photoURL: string;
	published: boolean;
	links: Link[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
	if ($user) {
		return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
	} else {
		set(null);
	}
});
