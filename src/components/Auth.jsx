import { auth, db, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🍪 Save auth token in cookie
      cookies.set("auth-token", user.refreshToken);
      setIsAuth(true);

      // 🧾 Create Firestore user document (if not exists)
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          joinedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("🛑 Error signing in:", err);
    }
  };

  return (
    <div className="auth flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 border border-green-300">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          🌿 Welcome to AgriChat
        </h1>
        <p className="text-gray-600 mb-6">Sign in with Google to start chatting with farmers and experts!</p>
        <button
          onClick={signInWithGoogle}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition font-semibold"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
