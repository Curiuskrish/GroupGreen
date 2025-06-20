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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ⛳ this component will move the map to the new position
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    console.log(location)
    map.setView(position, 13);
  }, [position]);
  return null;
};

const MapClickHandler = ({ setShowMap }) => {
  const { setLocation } = useLanguage();

  useMapEvents({
    click(e) {
      setLocation(e.latlng);


      setShowMap(false); // optional: close after click
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
          setShowMap(false);
          console.log("📍 GPS location set:", coords);
          
          console.log(location)
          
        },
        (err) => {
          console.error("Location error:", err);
          alert("Failed to get location.");
        }
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 border border-gray-300 mb-4">
      <button
        onClick={handleGetLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        📍 Use Current Location
      </button>

      <MapContainer
        center={location || [17.385, 78.4867]} // fallback to Hyderabad
        zoom={13}
        style={{
          aspectRatio: "1",
          width: "50%",
          margin: "0 auto",
          borderRadius: "50%",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setShowMap={setShowMap} />
        {location && <RecenterMap position={location} />}
        {location && (
          <Marker position={location}>
            <Popup>
              📍 Selected Location <br />
              Lat: {location.lat.toFixed(3)} <br />
              Lon: {location.lng.toFixed(3)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
