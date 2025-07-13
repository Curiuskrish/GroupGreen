import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherApp = ({ lat, lon }) => {
  const [forecastData, setForecastData] = useState([]);
  const apiKey = "77eb8bc44952b0c2a97636521fa83e43";

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: "metric",
          },
        });

        const dailyForecasts = res.data.list.filter(item =>
          item.dt_txt.includes("12:00:00")
        );

        setForecastData(dailyForecasts);
      } catch (err) {
        console.error("❌ Forecast fetch failed:", err);
      }
    };

    if (lat && lon) fetchForecast();
  }, [lat, lon]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mb-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">📆 5-Day Weather Forecast</h2>

      {forecastData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {forecastData.map((day, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-lg p-4 shadow hover:shadow-lg transition-all"
            >
              <p className="text-lg font-semibold text-green-800">
                {new Date(day.dt_txt).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-700 text-sm">🌡️ Temp: {day.main.temp}°C</p>
              <p className="text-gray-700 text-sm">🌤️ {day.weather[0].description}</p>
              <p className="text-gray-700 text-sm">💧 Humidity: {day.main.humidity}%</p>
              <p className="text-gray-700 text-sm">🌬️ Wind: {day.wind.speed} m/s</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">
          📍 Tap a location on the map to view the forecast.
        </p>
      )}
    </div>
  );
};

export default WeatherApp;
