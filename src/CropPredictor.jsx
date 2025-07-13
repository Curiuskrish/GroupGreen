import React, { useEffect, useState } from 'react';

const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M'; // your Gemini key

const CropPredictor = ({ lat, lon ,setCropDrop}) => {
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState(null);
  const [error, setError] = useState('');
  

  const askGemini = async (latitude, longitude) => {
    const prompt = `
You are an expert agricultural AI assistant trained using Indian agronomy datasets, ICAR guidelines, real soil/weather models, and market value data. Your goal is to recommend **highly profitable** crops for Indian farmers based on real-world feasibility and economic returns.

Given a location with these coordinates:
- Latitude: ${latitude}
- Longitude: ${longitude}

✅ Before making recommendations, you MUST:
1. Validate that the coordinates are located on land.
2. Ensure the location is within the geographical boundaries of **India**.
3. Confirm that the area is **suitable for agricultural farming** (e.g., not water bodies, cities, deserts, or rocky terrain).

If ANY of the above checks fail, return ONLY:
{
  "crops": ["no crops"]
}

✅ If the location is valid:
Return ONLY a JSON object with a single key "crops" containing an array of up to **10 most suitable, high-income generating crops** that can be cultivated there based on local **soil type, climate conditions, water availability**, and **seasonal trends**.

Each crop should include the following keys:
- "name": Name of the crop (e.g., "Cotton", "Paddy", "Tomato")
- "how_to_grow": A short, practical guide to growing it
- "water_needs": Water requirements (e.g., "High", "Moderate", "Low")
- "sunlight": Ideal sunlight exposure (e.g., "Full Sun", "Partial Shade")
- "soil_type": Suitable soil types (e.g., "Loamy", "Sandy Loam")
- "yield_info": Typical yield (e.g., "2.5 tons/acre" or "800 kg/hectare")

🧠 Prioritize **cash crops, fruits, vegetables, or pulses** that are economically viable, in-demand in the Indian market, and commonly supported by local mandis or agro-industries.

🚫 Do not guess. If uncertain about the region or missing data, return:
{
  "crops": ["no crops"]
}

📦 Output must be:
- **Strictly JSON**
- No markdown
- No extra text, description, or formatting
`;
//     const prompt = `
// Act as an expert agricultural AI trained in Indian agronomy, ICAR guidelines, and crop data. Given a location with these coordinates:
// Latitude: ${latitude}, Longitude: ${longitude}

// Before anything, validate the following:
// - Are these coordinates located on land?
// - Is the location within India?
// - Is it suitable for farming?

// Return ONLY a JSON object with a key called "crops" which is an array of **top 10 suitable crops** that can grow there based on soil, climate, and weather.
// If YES to all:
// Respond with a valid JSON like:
// For each crop, include:
// - "name"
// - "how_to_grow"
// - "water_needs"
// - "sunlight"
// - "soil_type"
// - "yield_info"

// If the location is invalid or unknown, return:
// {
//   "crops": ["no crops"]
// }
// Return ONLY valid JSON — do not include any explanations or markdown.
// return by checking the valid location conditions metioned above
// `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
if (json.crops && json.crops.length > 0 && json.crops[0] !== "no crops") {
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
  }, [lat, lon,setCropDrop]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-green-50 min-h-[20vh]">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        🌾 Crop Predictor (Gemini AI)
      </h1>

      {!lat || !lon ? (
        <p className="text-center text-gray-600">📍 Waiting for location input...</p>
      ) : loading ? (
        <p className="text-center text-gray-500">🌍 Predicting crops for your location...</p>
      ) : error ? (
        <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>
      ) : crops && crops.length === 1 && crops[0] === 'no crops' ? (
        <p className="text-red-600 font-bold text-center">🚫 No suitable crops found for this location.</p>
      ) : crops ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Top 10 Crops 🌿</h2>
          {crops.map((crop, idx) => (
            <div key={idx} className="bg-white shadow p-4 rounded border border-green-200 mb-4">
              <h3 className="text-lg font-bold mb-2">🌱 {idx + 1}. {crop.name}</h3>
              <p><strong>How to Grow:</strong> {crop.how_to_grow}</p>
              <p><strong>Water Needs:</strong> {crop.water_needs}</p>
              <p><strong>Sunlight:</strong> {crop.sunlight}</p>
              <p><strong>Soil Type:</strong> {crop.soil_type}</p>
              <p><strong>Yield Info:</strong> {crop.yield_info || 'N/A'}</p>
            </div>
          ))}
          <select onChange={(e)=>{
            setCropDrop(e.target.value)
          }} style={{width:"30%",margin:"auto"}} name="" id="">
          {crops.map((crop, idx) => (
           
              <option key={idx} value={crop.name}>🌱 {idx + 1}. {crop.name}</option>
            
          ))}

          </select>
          
        </>
      ) : null}
    </div>
  );
};

export default CropPredictor;
