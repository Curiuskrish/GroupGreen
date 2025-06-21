
import React from "react";
import { useLanguage } from "./LanguageContext";
import MiniChat from "./MiniChat";
import EnhancedWeather from "./EnhancedWeather";
import UserList from "./UserList";
import LocationModal from "./LocationModal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Dashboard = () => {
  const { location, setLocation } = useLanguage();

  const carouselItems = [
    {
      img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" ,
      title: "Smart Soil Sensors 🌱",
      desc: "Track real-time soil moisture for optimal watering.",
    },
    {
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      title: "AI Crop Advisor 🤖",
      desc: "Get AI-powered crop guidance based on weather & soil.",
    },
    {
      img: "https://images.unsplash.com/photo-1606149055000-72615d239b6e?auto=format&fit=crop&w=800&q=80",
      title: "Drone Monitoring 🚁",
      desc: "Aerial monitoring for disease detection & coverage.",
    },
    {
      img: "https://images.unsplash.com/photo-1606149055000-72615d239b6e?auto=format&fit=crop&w=800&q=80",
      title: "Drone Monitoring 🚁",
      desc: "Aerial monitoring for disease detection & coverage.",
    },
    {
      img: "https://images.unsplash.com/photo-1606149055000-72615d239b6e?auto=format&fit=crop&w=800&q=80",
      title: "Drone Monitoring 🚁",
      desc: "Aerial monitoring for disease detection & coverage.",
    },
  ];

  return (
    <div className="bg-[#0b0f0f] text-white min-h-screen p-4 md:p-6 font-sans">
      {/* 🔥 Carousel Banner */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-xl bg-[#0e1313]">
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
                <h3 className="text-lg font-bold text-green-300">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* ⚙️ Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 📍 Location Picker */}
        <div className="glass-card border border-green-500 rounded-xl p-4 shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-3">📍 Select Location</h2>
          <LocationModal
            onConfirm={(lat, lng) => {
              setLocation({ lat, lng });
              console.log("📍 Location set to:", lat, lng);
            }}
          />
        </div>

        {/* 🤖 Gemini Chat */}
        <div className="glass-card border border-blue-500 rounded-xl p-4 shadow-md col-span-1">
          <h2 className="text-lg font-semibold mb-3">🤖 Gemini Quick Chat</h2>
          <MiniChat />
        </div>

        {/* 🗣️ Users List */}
        <div className="glass-card border border-purple-500 rounded-xl p-4 shadow-md col-span-1 xl:col-span-2 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">🗣️ Trusted Farmers</h2>
          <UserList />
        </div>

        {/* ⛅ Weather Overview */}
        <div className="glass-card border border-sky-500 rounded-xl p-4 shadow-md col-span-1 md:col-span-2 xl:col-span-4">
          <h2 className="text-lg font-semibold mb-3">☁️ Weather Overview</h2>
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