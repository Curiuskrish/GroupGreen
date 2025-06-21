import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "./LanguageContext";

// 🧷 Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔁 Auto-pan map when new location is set
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
};

// 🎯 Handle user clicks on map
const MapClickHandler = ({ setShowMap }) => {
  const { setLocation } = useLanguage();
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
      if (setShowMap) setShowMap(false);
      console.log("🖱️ Clicked at:", e.latlng);
    },
  });
  return null;
};

const Map = ({ setShowMap }) => {
  const { location, setLocation } = useLanguage();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          if (setShowMap) setShowMap(false);
          console.log("📍 GPS location set:", coords);
        },
        (err) => {
          console.error("Location error:", err);
          alert("Failed to get your location.");
        }
      );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-gray-200 mb-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🌍 Choose Your Location</h2>

      <button
        onClick={handleGetLocation}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all mb-4"
      >
        📍 Use Current Location
      </button>

      <div className="rounded-2xl overflow-hidden border-2 border-blue-200">
        <MapContainer
          center={location || [17.385, 78.4867]} // Default: Hyderabad
          zoom={13}
          style={{
            height: "320px",
            width: "100%",
            borderRadius: "1rem",
          }}
          className="z-0"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler setShowMap={setShowMap} />
          {location && <RecenterMap position={location} />}

          {location && (
            <Marker position={location}>
              <Popup className="text-sm font-medium">
                📍 Selected Location
                <br />
                Lat: {location.lat.toFixed(3)}
                <br />
                Lon: {location.lng.toFixed(3)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
