
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "ai-travel-planner-d07b1.firebaseapp.com",
    projectId: "ai-travel-planner-d07b1",
    storageBucket: "ai-travel-planner-d07b1.firebasestorage.app",
    messagingSenderId: "353844607384",
    appId: "1:353844607384:web:7f73ad535c59c6e47393ed"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
