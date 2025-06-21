import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M';

const CropComparison = ({ lat, lon, crop }) => {
  const waterChartRef = useRef(null);
  const durationChartRef = useRef(null);
  const profitScoreChartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const promptGemini = async () => {
    const prompt = `You're an Indian agricultural data expert AI.\n
Given crop: "${crop}" at location (lat: ${lat}, lon: ${lon}), give a comparison of this crop with 4 other commonly grown crops in that area.
Return JSON with:
{
  "crops": ["Crop A", "Crop B", ..., "Crop E"],
  "water_requirements": [liters per acre per year],
  "growth_durations": [days to maturity],
  "profitability_scores": [score out of 100],
  "suggestions": ["Alt crop 1", "Alt crop 2", "Alt crop 3"]
}
Only valid JSON. No explanation.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const json = await res.json();
    const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(raw.replace(/```json|```/g, ''));
  };

  const renderChart = (ref, label, labels, values, color) => {
    if (!ref.current) return;

    new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label,
            data: values,
            backgroundColor: color,
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
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
        const result = await promptGemini();

        if (!result?.crops?.length) throw new Error("No crop data returned");

        setData(result);

        // slight delay so canvas mounts before drawing
        setTimeout(() => {
          renderChart(
            waterChartRef,
            'Water Requirement (L/acre/year)',
            result.crops,
            result.water_requirements,
            '#60a5fa'
          );
          renderChart(
            durationChartRef,
            'Growth Duration (Days)',
            result.crops,
            result.growth_durations,
            '#34d399'
          );
          renderChart(
            profitScoreChartRef,
            'Profitability Score',
            result.crops,
            result.profitability_scores,
            '#fbbf24'
          );
        }, 100);
      } catch (err) {
        console.error('🌾 Error fetching comparison:', err);
        setError('Unable to fetch crop comparison. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon, crop]);

  if (loading) return <p className="text-center text-gray-500 mt-4">🌿 Analyzing alternative crops for your area...</p>;
  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-green-800 text-center">
        🌾 {crop} vs Other Crops: Comparative Analysis
      </h2>

      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">💧 Water Requirement</h3>
        <canvas ref={waterChartRef} className="w-full max-h-[400px]" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-emerald-600 mb-2">📅 Growth Duration</h3>
        <canvas ref={durationChartRef} className="w-full max-h-[400px]" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">💸 Profitability Score</h3>
        <canvas ref={profitScoreChartRef} className="w-full max-h-[400px]" />
      </div>

      <div className="bg-green-100 p-4 rounded-xl shadow-md">
        <h4 className="text-xl font-semibold text-green-700 mb-2">🌟 Suggested Crops</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {data?.suggestions?.map((item, idx) => (
            <li key={idx}>✅ {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CropComparison;