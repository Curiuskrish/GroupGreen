import { useState } from "react";
import { auth, db, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Cookies } from "react-cookie";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import Map from "../Map";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const [role, setRole] = useState("farmer");
  const { language, setLanguage, location } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      cookies.set("auth-token", user.refreshToken);
      setIsAuth(true);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const dataToSave = {
        role,
        preferredLanguage: language,
        location,
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "Anonymous Farmer 🌾",
          email: user.email || "unknown@email.com",
          photoURL: user.photoURL || "",
          joinedAt: new Date().toISOString(),
          trustScore: 100,
          upvotedBy: [],
          downvotedBy: [],
          ...dataToSave,
        });
      } else {
        await setDoc(userRef, dataToSave, { merge: true });
      }

      navigate("/");
    } catch (err) {
      console.error("🛑 Google Sign-In failed:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md bg-white border border-green-200 rounded-2xl shadow-lg p-6 space-y-5">
        <h1 className="text-3xl font-bold text-green-700 text-center">🌿 Welcome to AgriChat</h1>
        <p className="text-sm text-gray-600 text-center">Sign in to start chatting with farmers and experts!</p>

        {/* 👨‍🌾 Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="farmer">👨‍🌾 Farmer</option>
            <option value="vendor">🛒 Vendor</option>
            <option value="normal">🙋 Normal User</option>
            <option value="expert">🧠 Expert</option>
          </select>
        </div>

        {/* 🌐 Language */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="English">🇬🇧 English</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Telugu">🇮🇳 Telugu</option>
            <option value="Tamil">🇮🇳 Tamil</option>
            <option value="Kannada">🇮🇳 Kannada</option>
            <option value="Bengali">🇮🇳 Bengali</option>
            <option value="Marathi">🇮🇳 Marathi</option>
          </select>
        </div>

        {/* 📍 Location Picker */}
        <div>
          <button
            onClick={() => setShowMap(true)}
            className={`w-full px-4 py-2 rounded-md border transition ${
              location
                ? "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                : "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            }`}
          >
            {location ? "📌 Location Selected" : "📍 Click to Set Your Location"}
          </button>
          {showMap && <Map setShowMap={setShowMap} />}
        </div>

        {/* ✅ Google Sign In */}
        <button
          onClick={signInWithGoogle}
          disabled={!location}
          className={`w-full px-5 py-2 rounded-lg font-semibold shadow-md transition duration-200 ${
            location
              ? "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {location ? "Sign in with Google" : "📍 Please select location first"}
        </button>
      </div>
    </div>
  );
};
