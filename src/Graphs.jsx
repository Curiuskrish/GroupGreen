import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M';

const Graphs = ({ lat, lon, crop }) => {
  const yieldChartRef = useRef(null);
  const rateChartRef = useRef(null);
  const profitChartRef = useRef(null);

  const yieldChartInstance = useRef(null);
  const rateChartInstance = useRef(null);
  const profitChartInstance = useRef(null);

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });

    const resData = await response.json();
    const raw = resData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Strip unwanted "```json" or "```" if they appear
    return raw.trim().replace(/```json|```/g, '');
  };

  const renderChart = (ctx, data, label, color, instanceRef) => {
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const key = label.toLowerCase().includes('yield')
      ? 'yields'
      : label.toLowerCase().includes('rate')
      ? 'rates'
      : 'profits';

    instanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.years,
        datasets: [
          {
            label,
            data: data[key],
            borderColor: color,
            backgroundColor: `${color}1A`,
            tension: 0.3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
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
        const json = JSON.parse(raw);

        const { crop: cropLabel, years, yields, rates, profits } = json;

        if (
          !Array.isArray(years) || !Array.isArray(yields) ||
          !Array.isArray(rates) || !Array.isArray(profits) ||
          years.length !== 10
        ) {
          throw new Error('Invalid or incomplete data');
        }

        setCropName(cropLabel || crop);

        setTimeout(() => {
          renderChart(yieldChartRef.current, json, 'Yield (kg/acre)', '#3b82f6', yieldChartInstance);
          renderChart(rateChartRef.current, json, 'Market Rate (₹/kg)', '#10b981', rateChartInstance);
          renderChart(profitChartRef.current, json, 'Profit Estimate (₹)', '#f97316', profitChartInstance);
        }, 100);
      } catch (err) {
        console.error('🚨 Gemini error:', err);
        setError('Failed to load crop statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon, crop]);

  if (loading) return <p className="text-center text-gray-500 mt-4">🌾 Fetching historical crop data...</p>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold text-green-800 text-center">
        📊 {cropName} Yield & Profit Trends (10 Years)
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
