import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChatApp from "./ChatApp";
import CropPage from "./CropPage";
import Chatbot from "./chatbot";
import Schemes from "./components/Schemes";
import Navbar from "./components/Navbar";
import PlantDiseaseUI from "./components/PlantDiseaseDetector";
import { LanguageProvider } from "./LanguageContext";
import { Auth } from "./components/Auth";
import { LocationProvider } from "./LocationContext";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-[#eafaf1] via-[#f4fdf7] to-[#d4f4e7] text-[#1f3b29]">
          <Navbar
            className="w-full sticky top-0 z-50 bg-white/30 backdrop-blur-lg shadow-md border-b border-green-200"
            data-aos="fade-down"
          />
          <main className="pt-4 pb-12 px-4 md:px-8 lg:px-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<ChatApp />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/crop" element={<CropPage />} />
              <Route path="/detect" element={<PlantDiseaseUI />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/schemes" element={<Schemes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
