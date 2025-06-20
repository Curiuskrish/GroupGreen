import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const SoilDataFetcher = ({ lat, lon }) => {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSoilData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}`
      );
      setSoilData(response.data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (lat && lon) {
      fetchSoilData();
    }
  }, [lat, lon]);

  return (
    <div className="p-6 bg-green-100 rounded-xl max-w-md mx-auto mt-10 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-green-900">🌾 SoilGrids Checker</h2>

      {loading && <p className="mt-4 text-yellow-700">Loading soil secrets...</p>}

      {soilData && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">🌍 Location: ({lat}, {lon})</h3>
          <p><strong>pH (H₂O):</strong> {soilData.properties.phh2o?.depths[0]?.values?.mean}</p>
          <p><strong>Organic Carbon (g/kg):</strong> {soilData.properties.ocd?.depths[0]?.values?.mean}</p>
        </div>
      )}

      {!soilData && !loading && (
        <p className="text-gray-700">Click on the map to fetch soil data 🌍</p>
      )}
    </div>
  );
};
