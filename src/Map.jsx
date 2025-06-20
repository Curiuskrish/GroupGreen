// Map.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng); // send to App.jsx
        console.log("🌍 Clicked at", e.latlng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[17.385, 78.4867]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='© OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {position && (
        <Marker position={position}>
          <Popup>
            Lat: {position.lat.toFixed(3)} <br />
            Lon: {position.lng.toFixed(3)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LocationPicker;
