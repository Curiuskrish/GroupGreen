import React, { useState } from "react";
import LocationPicker from "./Map";
import WeatherApp from "./Weather";
import CropPredictor from "./CropPredictor";
import Graphs from "./Graphs";
import Graphs2 from "./Graphs2";
import { useLanguage } from "./LanguageContext";
useLanguage// 👈 import the context

const CropPage = () => {
  const { location } = useLanguage(); // ✅ get global coords
  const [crop, setCrop] = useState(null);

  return (
    <div className="p-6 min-h-screen bg-green-50 text-center space-y-6">
      <h2 className="text-2xl font-bold text-green-800">🌾 Crop Tools</h2>

      <LocationPicker /> {/* no need to pass onLocationSelect */}

      {!location && (
        <p className="text-gray-500">📍 Please select a location to continue.</p>
      )}

      {location && (
        <>
          <WeatherApp lat={location.lat} lon={location.lng} />
          <CropPredictor
            setCropDrop={setCrop}
            lat={location.lat}
            lon={location.lng}
          />
          <Graphs lat={location.lat} lon={location.lng} crop={crop} />
          <Graphs2 lat={location.lat} lon={location.lng} crop={crop} />
        </>
      )}
    </div>
  );
};

export default CropPage;
