// Weather.jsx
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

        // Filter data: one entry per day around 12:00 PM
        const dailyForecasts = res.data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecastData(dailyForecasts);
      } catch (err) {
        console.error("❌ Forecast fetch failed:", err);
      }
    };

    if (lat && lon) fetchForecast();
  }, [lat, lon, apiKey]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h3>📆 5-Day Forecast</h3>
      {forecastData.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {forecastData.map((day, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                minWidth: "150px",
                background: "#f4f4f4",
              }}
            >
                
              <p><strong>{new Date(day.dt_txt).toDateString()}</strong></p>
              <p>🌡️ Temp: {day.main.temp}°C</p>
              <p>🌤️ {day.weather[0].description}</p>
              <p>💧 Humidity: {day.main.humidity}%</p>
              <p>🌬️ Wind: {day.wind.speed} m/s</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Click a location on the map to see the 5-day forecast ⛅</p>
      )}
    </div>
  );
};

export default WeatherApp;
