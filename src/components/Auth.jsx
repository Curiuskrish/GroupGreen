import { useState } from "react";
import { auth, db, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Cookies } from "react-cookie";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
 // ✅ context for language & location// 👈 create this component to pick location
import Map from '../Map';
const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const [role, setRole] = useState("farmer");
  const { language, setLanguage, location } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  
// console.log("📍 Location from context:", location);/
console.log("🧼 Clean location:", JSON.stringify(location)); 

 const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("🎯 Signed in user:", user);

    cookies.set("auth-token", user.refreshToken);
    setIsAuth(true);
  
    
    
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    const dataToSave = {
      role,
      preferredLanguage: language,
      location,
    };
 // or "/home", depending on your routing

    if (!userSnap.exists()) {
      console.log("🚧 Creating new user doc...");
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous Farmer 🌾",
        email: user.email || "unknown@email.com",
        photoURL: user.photoURL || "",
        joinedAt: new Date().toISOString(),
        trustScore: 100,
        upvotedBy: [],
        downvotedBy: [],
        
      });
      console.log(`✅ New user created: ${user.displayName}`);
    } else {
      console.log("🟢 Existing user found. Updating...");
      await setDoc(userRef, dataToSave, { merge: true });
    }
       navigate("/"); 
  } catch (err) {
    console.error("🛑 Google Sign-In failed:", err.message);
  }
};

  return (
    <div className="auth flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 border border-green-300">
        <h1 className="text-2xl font-bold text-green-700 mb-4">🌿 Welcome to AgriChat</h1>
        <p className="text-gray-600 mb-4">Sign in with Google to start chatting with farmers and experts!</p>

        {/* 🌱 Role */}
        <label className="block text-left text-gray-700 font-medium mb-2">Select your role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-4 w-full p-2 border border-green-300 rounded-md"
        >
          <option value="farmer">👨‍🌾 Farmer</option>
          <option value="vendor">🛒 Vendor</option>
          <option value="normal">🙋 Normal User</option>
          <option value="expert">🧠 Expert</option>
        </select>

        {/* 🌍 Language */}
        <label className="block text-left text-gray-700 font-medium mb-2">Preferred language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-6 w-full p-2 border border-green-300 rounded-md"
        >
          <option value="English">🇬🇧 English</option>
          <option value="Hindi">🇮🇳 Hindi</option>
          <option value="Telugu">🇮🇳 Telugu</option>
          <option value="Tamil">🇮🇳 Tamil</option>
          <option value="Kannada">🇮🇳 Kannada</option>
          <option value="Bengali">🇮🇳 Bengali</option>
          <option value="Marathi">🇮🇳 Marathi</option>
        </select>

        {/* 📍 Location Picker */}
        <button
          onClick={() => setShowMap(true)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md mb-4 w-full border border-blue-300"
        >
          {location ? "📌 Location Selected" : "📍 Click to Select Location"}
        </button>

        {showMap && <Map setShowMap={setShowMap} />} {/* 👈 Optional modal for map */}

        {/* ✅ Sign In */}
        <button
          onClick={signInWithGoogle}
          disabled={!location}
          className={`${
            location ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          } text-white px-6 py-2 rounded-lg transition font-semibold w-full`}
        >
          {location ? "Sign in with Google" : "📍 Please set your location"}
        </button>
      </div>
    </div>
  );
};
