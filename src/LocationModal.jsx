import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker Icon Fix
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPickerMap = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const LocationModal = ({ onConfirm }) => {
  const [show, setShow] = useState(false);
  const [tempLatLng, setTempLatLng] = useState(null);
  const [mounted, setMounted] = useState(false); // Important for hydration fix

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    if (tempLatLng) {
      onConfirm(tempLatLng.lat, tempLatLng.lng);
      setShow(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        📍 Pick Location
      </button>

      {show && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-4 w-[95%] max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-center">🌍 Select Location</h2>

            {mounted && (
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "250px", borderRadius: "10px" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPickerMap
                  onSelect={(lat, lng) => setTempLatLng({ lat, lng })}
                />
              </MapContainer>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShow(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!tempLatLng}
                className={`px-4 py-1 rounded ${
                  tempLatLng
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationModal;
