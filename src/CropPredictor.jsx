import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M'; // Replace with env in production

const CropPredictor = ({ lat, lon, setCropDrop }) => {
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState(null);
  const [error, setError] = useState('');
  const { language } = useLanguage();

  const askGemini = async (latitude, longitude) => {
    const prompt = `
You are an expert agricultural AI assistant trained using Indian agronomy datasets, ICAR guidelines, real soil/weather models, and market value data. Your goal is to recommend **highly profitable** crops for Indian farmers based on real-world feasibility and economic returns.

Given a location with these coordinates:
- Latitude: ${latitude}
- Longitude: ${longitude}
- give response only in ${language}

... [prompt continues] ...
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response 😢';
  };

  useEffect(() => {
    const fetchCrops = async () => {
      if (!lat || !lon) return;

      setLoading(true);
      setError('');
      setCrops(null);

      try {
        const reply = await askGemini(lat, lon);
        const clean = reply.trim().replace(/```json\s*|\s*```/g, '');
        const json = JSON.parse(clean);
        setCrops(json.crops);

        if (json.crops && json.crops.length > 0 && json.crops[0] !== 'no crops') {
          setCropDrop(json.crops[0].name);
        }
      } catch (err) {
        console.error('❌ Error parsing Gemini response:', err);
        setError('⚠️ Failed to parse AI response.');
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [lat, lon, setCropDrop]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-green-200 text-[#1f3b29]">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        🌾 Crop Predictor (Gemini AI)
      </h1>

      {!lat || !lon ? (
        <p className="text-center text-gray-600">
          📍 Waiting for location input...
        </p>
      ) : loading ? (
        <p className="text-center text-gray-500 animate-pulse">
          🌍 Predicting crops for your location...
        </p>
      ) : error ? (
        <div className="text-red-700 bg-red-100 border border-red-300 rounded-lg p-4 text-center font-medium">
          {error}
        </div>
      ) : crops && crops.length === 1 && crops[0] === 'no crops' ? (
        <p className="text-center text-red-600 font-semibold">
          🚫 No suitable crops found for this location.
        </p>
      ) : crops ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-green-700 text-left">🌿 Top Recommended Crops</h2>

          {crops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-white border border-green-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-lg font-bold text-green-800 mb-2">
                🌱 {idx + 1}. {crop.name}
              </h3>
              <p><strong>How to Grow:</strong> {crop.how_to_grow}</p>
              <p><strong>Water Needs:</strong> {crop.water_needs}</p>
              <p><strong>Sunlight:</strong> {crop.sunlight}</p>
              <p><strong>Soil Type:</strong> {crop.soil_type}</p>
              <p><strong>Yield Info:</strong> {crop.yield_info || 'N/A'}</p>
            </div>
          ))}

          <div className="mt-6 text-center">
            <label className="block text-green-800 font-medium mb-2">
              Select a crop to analyze further:
            </label>
            <select
              className="w-64 px-4 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setCropDrop(e.target.value)}
            >
              {crops.map((crop, idx) => (
                <option key={idx} value={crop.name}>
                  🌱 {idx + 1}. {crop.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CropPredictor;
