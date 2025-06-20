// Map.jsx
import React, { useState } from "react";
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

// Fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to recenter map view
const RecenterMap = ({ position }) => {
  const map = useMap();
  map.setView(position, 13);
  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [showRecenter, setShowRecenter] = useState(false);

  // Get live location on button click
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords);
          onLocationSelect(coords);
          setShowRecenter(true);
          console.log("📍 Live location:", coords);
        },
        (err) => {
          console.error("Location error:", err);
          alert("Failed to get location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Map click updates position
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
        setShowRecenter(false);
        console.log("🌍 Clicked at", e.latlng);
      },
    });
    return null;
  };

  return (
    <div>
      <button
        onClick={handleGetLocation}
        style={{
          padding: "10px 20px",
          marginBottom: "10px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        📍 Get Current Location
      </button>

      <MapContainer
        center={[17.385, 78.4867]}
        zoom={13}
        style={{ aspectRatio: "1", width: "50%", margin: "0 auto",borderRadius: "50%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {position && (
          <>
            {showRecenter && <RecenterMap position={position} />}
            <Marker position={position}>
              <Popup>
                📍 Your Location <br />
                Lat: {position.lat.toFixed(3)} <br />
                Lon: {position.lng.toFixed(3)}
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
