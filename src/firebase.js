import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 🧠 Needed for chat DB
import { getAuth, GoogleAuthProvider} from "firebase/auth"; // 🧠 Needed for chat DB
// import { getAnalytics } from "firebase/analytics"; // Optional for later use

const firebaseConfig = {
  apiKey: "AIzaSyD-lZQq6vfA88vn8oyZjP3hOFEFKV8ZHd0",
  authDomain: "groupgreen-589a5.firebaseapp.com",
  projectId: "groupgreen-589a5",
  storageBucket: "groupgreen-589a5.appspot.com", // <-- fixed typo here
  messagingSenderId: "453214787954",
  appId: "1:453214787954:web:97c926cfd040847207a5eb",
  measurementId: "G-L28YQ2Y6Q2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const provider =new GoogleAuthProvider()
// Firestore for real-time messaging
const db = getFirestore(app);

// ✅ Optional: Analytics (can remove if not needed)
// const analytics = getAnalytics(app);

export { db };