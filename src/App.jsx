// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChatApp from "./ChatApp";
import CropPage from "./CropPage";
import Chatbot from "./chatbot";
import Schemes from "./components/Schemes";
import Sidebar from "./components/Navbar";
import PlantDiseaseUI from "./components/PlantDiseaseDetector";
import { LanguageProvider } from "./LanguageContext";
import { Auth } from "./components/Auth";
import { LocationProvider } from "./LocationContext";



function App() {
  return (
    <>
    <LanguageProvider> {/* ✅ Wrap everything in Language Context */}
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Sidebar /> {/* Navbar stays outside of Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/login" element={<Auth />} /> {/* 👈 New route */}
            <Route path="/crop" element={<CropPage />} />
            <Route path="/detect" element={<PlantDiseaseUI />} />
            <Route path="/comfort" element={<Chatbot />} />
            <Route path="/schemes" element={<Schemes />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider></>
  );
}

export default App;
