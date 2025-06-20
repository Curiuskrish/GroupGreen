import { useState } from "react";
import { Auth } from "./components/Auth";
import { Cookies } from "react-cookie";
import "./App.css";

import PlantDiseaseUI from "./components/PlantDiseaseDetector.jsx";
import WeatherApp from "./Weather.jsx";
import LocationPicker from "./Map.jsx";
import CropPredictor from "./CropPredictor.jsx";
import Graphs from "./Graphs.jsx";
import Graphs2 from "./Graphs2.jsx";
import Schemes from "./components/Schemes.jsx";
import ChatBot from "./chatbot.jsx";
// import Nav from "./components/Navbar.jsx";
import ChatApp from "./ChatApp.jsx"; // ✅ new modular version
import CropPage from "./CropPage.jsx";
import { useLanguage } from "./LanguageContext";




const cookies = new Cookies();

function Home() {
  const { language } = useLanguage();
//   const [coords, setCoords] = useState(null);
//   const [crop, setCrop] = useState(null);
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
//   const [room, setRoom] = useState(null);

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 to-green-200">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

  
<div>
      <h2>Welcome! 👋</h2>
      <p>🗣️ You selected: <strong>{language}</strong></p>
    </div>
  
  
</div>

  );
}

export default Home;
