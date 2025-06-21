import React, { useState } from "react";
import LocationPicker from "./Map";
import WeatherApp from "./Weather";
import CropPredictor from "./CropPredictor";
import Graphs from "./Graphs";
import Graphs2 from "./Graphs2";
import { useLanguage } from "./LanguageContext";

const CropPage = () => {
  const { location } = useLanguage();
  const [crop, setCrop] = useState(null);

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 py-10 bg-gradient-to-br from-[#f0fef4] to-[#d0f2e3] text-[#1f3b29]">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-bold text-green-800">🌾 Smart Crop Tools</h2>

        <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
          <LocationPicker />
        </div>

        {!location && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg shadow-md">
            📍 Please select a location to continue.
          </div>
        )}

        {location && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
              <WeatherApp lat={location.lat} lon={location.lng} />
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
              <CropPredictor
                setCropDrop={setCrop}
                lat={location.lat}
                lon={location.lng}
              />
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
              <Graphs lat={location.lat} lon={location.lng} crop={crop} />
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
              <Graphs2 lat={location.lat} lon={location.lng} crop={crop} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPage;
