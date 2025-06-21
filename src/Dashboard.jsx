import React from "react";
import { useLanguage } from "./LanguageContext";
import MiniChat from "./MiniChat";
import EnhancedWeather from "./EnhancedWeather";
import UserList from "./UserList";
import LocationModal from "./LocationModal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ChatroomImg from "../src/assets/Chatroom.png";
import CropImg from "../src/assets/Crop.png";
import DImg from "../src/assets/d.png";
import SchemesImg from "../src/assets/Schemes.png";

const Dashboard = () => {
  const { location, setLocation } = useLanguage();

  const carouselItems = [
    {
      img: ChatroomImg,
      title: "Community Chatroom",
      desc: "Connect with nearby farmers and share insights.",
    },
    {
      img: CropImg,
      title: "Smart Crop Advisor",
      desc: "AI recommends crops based on your soil and weather.",
    },
    {
      img: DImg,
      title: "Drone Monitoring",
      desc: "Real-time drone footage for crop health and safety.",
    },
    {
      img: SchemesImg,
      title: "Govt Schemes & Support",
      desc: "Get updates on farming schemes and financial aid.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#0b0f0f] to-[#0f1e1e] text-white min-h-screen p-4 md:p-6 font-sans">
      {/* 🔥 Carousel Banner */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/10 border border-white/10">
        <Carousel
          autoPlay
          infiniteLoop
          interval={4000}
          showStatus={false}
          showThumbs={false}
          showArrows
        >
          {carouselItems.map((item, i) => (
            <div key={i} className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="object-cover h-72 w-full brightness-90 rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-left rounded-b-xl">
                <h3 className="text-lg font-bold text-green-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* ⚙️ Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 📍 Location Picker */}
        <div className="glass-card backdrop-blur-md bg-white/10 border border-emerald-500 rounded-xl p-4 shadow-lg col-span-1 order-2 sm:order-1">
          <h2 className="text-lg font-semibold mb-3 text-emerald-300">
            📍 Select Location
          </h2>
          <LocationModal
            onConfirm={(lat, lng) => {
              setLocation({ lat, lng });
              console.log("📍 Location set to:", lat, lng);
            }}
          />
        </div>

        {/* 🤖 Gemini Chat */}
        <div className="glass-card backdrop-blur-md bg-white/10 border border-cyan-400 rounded-xl p-4 shadow-lg col-span-1 order-3 sm:order-2">
          <h2 className="text-lg font-semibold mb-3 text-cyan-300">
            🤖 Gemini Quick Chat
          </h2>
          <MiniChat />
        </div>

        {/* 🗣️ Users List */}
        <div className="glass-card backdrop-blur-md bg-white/10 border border-purple-500 rounded-xl p-4 shadow-lg col-span-1 xl:col-span-2 order-4 sm:order-3 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-purple-300">
            🗣️ Trusted Farmers
          </h2>
          <UserList />
        </div>

        {/* ⛅ Weather Overview */}
        <div className="glass-card backdrop-blur-md bg-white/10 border border-sky-500 rounded-xl p-4 shadow-lg col-span-1 sm:col-span-2 xl:col-span-4 order-5 sm:order-4">
          <h2 className="text-lg font-semibold mb-3 text-sky-300">
            ☁️ Weather Overview
          </h2>
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
