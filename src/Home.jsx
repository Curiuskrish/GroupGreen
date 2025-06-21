import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Cookies } from "react-cookie";
import Auth from "./components/Auth";
import Nav from "./components/Navbar";
import "./App.css";

const Dashboard = lazy(() => import("./Dashboard"));
const CropPage = lazy(() => import("./CropPage"));
const WeatherApp = lazy(() => import("./Weather"));
const PlantDiseaseUI = lazy(() => import("./components/PlantDiseaseDetector"));
const Schemes = lazy(() => import("./components/Schemes"));
const ChatApp = lazy(() => import("./ChatApp"));

const cookies = new Cookies();

function MainApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  const handleLogout = () => {
    cookies.remove("auth-token");
    setIsAuth(false);
  };

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 to-green-200">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav onLogout={handleLogout} />
      <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crop-tools" element={<CropPage />} />
          <Route path="/weather" element={<WeatherApp />} />
          <Route path="/disease" element={<PlantDiseaseUI />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default MainApp;