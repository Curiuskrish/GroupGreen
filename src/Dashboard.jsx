import React from "react";
import { useLanguage } from "./LanguageContext";
import MiniChat from "./MiniChat";
import EnhancedWeather from "./EnhancedWeather";
import UserList from "./UserList";
import LocationModal from "./LocationModal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// 🖼️ Import your local images
import ChatroomImg from "./assets/Chatroom.png";
import CropImg from "./assets/Crop.png";


import SchemesImg from "./assets/Schemes.png";

const Dashboard = () => {
  const { location, setLocation } = useLanguage();

  const carouselItems = [
    {
      img: CropImg,
      title: "AI Crop Advisor 🌾",
      desc: "Smart crop recommendations just one tap away.",
    },
    
    {
      img: ChatroomImg,
      title: "Farmer Chatrooms 🗣️",
      desc: "Connect with experts and your local legends.",
    },
    {
      img: SchemesImg,
      title: "Govt. Schemes 💰",
      desc: "Get insights on the latest farmer benefits.",
    },
    
  ];

  return (
    <div className="bg-gradient-to-br from-[#0a0f0f] via-[#0b1312] to-[#0d1513] text-white min-h-screen p-4 md:p-6 font-sans">
      {/* 🔥 Carousel Banner */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
        <Carousel
          autoPlay
          infiniteLoop
          interval={5000}
          showStatus={false}
          showThumbs={false}
          showArrows
        >
          {carouselItems.map((item, i) => (
            <div key={i} className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="object-cover h-72 w-full brightness-90"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 rounded-b-2xl">
                <h3 className="text-xl font-bold text-green-300">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* ⚙️ Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 📍 Location Picker */}
        <div className="bg-white/10 backdrop-blur-md border border-green-500 rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-green-300">📍 Select Location</h2>
          <LocationModal
            onConfirm={(lat, lng) => {
              setLocation({ lat, lng });
              console.log("📍 Location set to:", lat, lng);
            }}
          />
        </div>

        {/* 🤖 Gemini Chat */}
        <div className="bg-white/10 backdrop-blur-md border border-blue-500 rounded-2xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-blue-300">🤖 Gemini Quick Chat</h2>
          <MiniChat />
        </div>

        {/* 🗣️ Users List */}
        <div className="bg-white/10 backdrop-blur-md border border-purple-500 rounded-2xl p-5 shadow-lg col-span-1 xl:col-span-2 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-purple-300">🗣️ Trusted Farmers</h2>
          <UserList />
        </div>

        {/* ⛅ Weather Overview */}
        <div className="bg-white/10 backdrop-blur-md border border-sky-500 rounded-2xl p-5 shadow-lg col-span-1 md:col-span-2 xl:col-span-4">
          <h2 className="text-lg font-semibold mb-3 text-sky-300">☁️ Weather Overview</h2>
          {location?.lat && location?.lng ? (
            <EnhancedWeather lat={location.lat} lon={location.lng} />
          ) : (
            <p className="text-gray-400">📍 Pick a location to see forecast</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
