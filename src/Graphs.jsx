import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M';

const Graphs = ({ lat, lon, crop }) => {
  const yieldChartRef = useRef(null);
  const rateChartRef = useRef(null);
  const profitChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [cropName, setCropName] = useState('');
  const [error, setError] = useState('');

  const askGemini = async (lat, lon, crop) => {
    const prompt = `
You are an expert in Indian agronomy and crop economics.

Given:
- Location: Latitude ${lat}, Longitude ${lon}
- Crop: ${crop}

Provide yearly agricultural data **for the crop "${crop}" at this location**, for the past 10 years.

Return ONLY a valid JSON like:
{
  "crop": "${crop}",
  "years": [2015, 2016, ..., 2024],
  "yields": [kg per acre],
  "rates": [₹ per kg],
  "profits": [₹ estimated profit]
}
Do NOT return markdown or explanation.
    `.trim();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const resData = await response.json();
    const raw = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return raw.trim().replace(/```json|```/g, '');
  };

  const displayCharts = (data) => {
    if (!yieldChartRef.current || !rateChartRef.current || !profitChartRef.current) return;

    const commonOptions = {
      type: 'line',
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      },
    };

    new Chart(yieldChartRef.current, {
      ...commonOptions,
      data: {
        labels: data.years,
        datasets: [
          {
            label: 'Yield (kg/acre)',
            data: data.yields,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
    });

    new Chart(rateChartRef.current, {
      ...commonOptions,
      data: {
        labels: data.years,
        datasets: [
          {
            label: 'Market Rate (₹/kg)',
            data: data.rates,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
    });

    new Chart(profitChartRef.current, {
      ...commonOptions,
      data: {
        labels: data.years,
        datasets: [
          {
            label: 'Profit Estimate (₹)',
            data: data.profits,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
    });
  };

  useEffect(() => {
    if (!lat || !lon || !crop) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const raw = await askGemini(lat, lon, crop);
        const data = JSON.parse(raw);

        if (
          !data?.years || !data?.yields || !data?.rates || !data?.profits ||
          data.years.length !== 10 || data.yields.length !== 10 || data.rates.length !== 10 || data.profits.length !== 10
        ) {
          throw new Error('Incomplete or invalid Gemini data');
        }

        setCropName(data.crop);
        setTimeout(() => displayCharts(data), 100);
      } catch (err) {
        console.error('🚨 Gemini error:', err);
        setError('Failed to load real crop data. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon, crop]);

  if (loading) return <p className="text-center text-gray-500 mt-4">🌾 Fetching crop data for your location...</p>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-green-800 text-center">
        📊 {cropName} Yield & Profit Analysis (10 Years)
      </h2>

      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">🌱 Yield (kg/acre)</h3>
        <canvas ref={yieldChartRef} className="w-full max-h-[400px]" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-emerald-600 mb-2">💰 Market Rate (₹/kg)</h3>
        <canvas ref={rateChartRef} className="w-full max-h-[400px]" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-2">📈 Profit Estimate (₹)</h3>
        <canvas ref={profitChartRef} className="w-full max-h-[400px]" />
      </div>
    </div>
  );
};

export default Graphs;
