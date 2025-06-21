// src/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "./components/Auth";
import { useLanguage } from "./LanguageContext";
import { auth } from "./firebase";
import AnimatedBanner from "./components/AnimatedBanner";

const Home = () => {
  const navigate = useNavigate();
  const { location } = useLanguage();

  // 👀 Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard"); // 🌍 Redirect to dashboard
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-100 to-green-50">
      <AnimatedBanner />

      <div className="glass-card p-8 rounded-3xl shadow-2xl max-w-xl w-full space-y-6 mt-[-60px] z-10">
        <h1 className="text-4xl font-extrabold text-green-700">🌱 Welcome to GreenConnect</h1>
        <p className="text-lg text-gray-700">
          Empowering{" "}
          <span className="text-green-600 font-bold">Farmers</span>,{" "}
          <span className="text-green-600 font-bold">Vendors</span>, and{" "}
          <span className="text-green-600 font-bold">Experts</span> with one smart, green dashboard 🌍
        </p>

        {/* 🔐 Show Auth only if not logged in */}
        <Auth setIsAuth={() => {}} />
      </div>
    </div>
  );
};

export default Home;
