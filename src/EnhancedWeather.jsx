import React, { useEffect, useState } from "react";

const EnhancedWeather = ({ lat, lon }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "77eb8bc44952b0c2a97636521fa83e43"; // Use ENV in production

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        setForecast(data);
      } catch (err) {
        console.error("❌ Error fetching forecast:", err);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) fetchForecast();
  }, [lat, lon]);

  if (loading)
    return (
      <p className="text-blue-300 italic text-center animate-pulse">
        Loading 5-day forecast... ⛅
      </p>
    );

  if (!forecast || forecast.cod !== "200")
    return (
      <p className="text-red-400 italic text-center">
        Failed to load forecast 😓
      </p>
    );

  const current = forecast.list[0];
  const dailyForecasts = forecast.list.filter((_, index) => index % 8 === 0);

  return (
    <div className="flex flex-col gap-6">
      {/* 🔥 Current Weather Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-blue-400 text-white text-center">
        <h3 className="text-2xl font-bold text-green-300 mb-2">
          {forecast.city.name}, {forecast.city.country}
        </h3>
        <img
          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
          alt={current.weather[0].description}
          className="w-24 h-24 mx-auto"
        />
        <p className="text-4xl font-semibold">{current.main.temp.toFixed(1)}°C</p>
        <p className="capitalize text-lg text-gray-200">
          {current.weather[0].description}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Feels like {current.main.feels_like.toFixed(1)}°C | Humidity:{" "}
          {current.main.humidity}%
        </p>
      </div>

      {/* 📅 5-Day Forecast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day, i) => {
          const date = new Date(day.dt_txt);
          const options = { weekday: "short", month: "short", day: "numeric" };
          const icon = day.weather[0].icon;

          return (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md text-white rounded-xl p-4 shadow-lg border border-sky-500 flex flex-col items-center hover:ring-2 hover:ring-green-400 transition"
            >
              <p className="text-sm text-blue-300 font-medium mb-1">
                {date.toLocaleDateString("en-US", options)}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-16 h-16"
              />
              <p className="text-lg font-semibold text-green-300">
                {day.main.temp.toFixed(1)}°C
              </p>
              <p className="capitalize text-sm text-gray-300">
                {day.weather[0].description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Feels like {day.main.feels_like.toFixed(1)}°C
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedWeather;
