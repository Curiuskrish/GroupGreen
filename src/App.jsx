import { useEffect, useRef, useState } from "react";
import { Auth } from "./components/Auth";
import { Cookies } from "react-cookie";
import Chatro from "./components/Chatro";
import "./App.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

import WeatherApp from "./Weather.jsx";
import LocationPicker from "./Map.jsx";
import CropPredictor from "./CropPredictor.jsx";
import Graphs from "./Graphs.jsx";

const cookies = new Cookies();

function App() {
  const [allRooms, setAllRooms] = useState([]);
  const [coords, setCoords] = useState(null);
  const [crop, setCrop] = useState(null);
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);

  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       const roomRef = collection(db, "chatrooms");
  //       const snapshot = await getDocs(roomRef);
  //       const roomNames = snapshot.docs.map((doc) => doc.id);
  //       console.log("Fetched Rooms:", roomNames);
  //       setAllRooms(roomNames);
  //     } catch (err) {
  //       console.error("Failed to fetch rooms:", err);
  //     }
  //   };

  //   fetchRooms();
  // }, []);

useEffect(() => {
  if (!isAuth) return; // 🛑 Don't try to fetch if not logged in

  const fetchRooms = async () => {
    try {
      const roomRef = collection(db, "chatrooms");
      const snapshot = await getDocs(roomRef);
      const roomNames = snapshot.docs.map(doc => doc.id);
      console.log("ROOMS:", roomNames);
      setAllRooms(roomNames);
    } catch (err) {
      console.error("❌ Failed to fetch rooms:", err);
    }
  };

  fetchRooms();
}, [isAuth]); // 👈 Add isAuth as a dependency

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 to-green-200">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* 💬 Left: Chat Section */}
      <div className="lg:w-1/2 w-full p-4 bg-white shadow-md z-10">
        {!room ? (
          <div className="flex flex-col gap-6 items-center justify-center mt-10">
            <div className="text-center">
              <label className="text-xl font-semibold text-green-700 mb-2 block">
                🌾 Enter Room Name
              </label>
              <input
                ref={roomInputRef}
                type="text"
                placeholder="Ex: cotton-telangana"
                className="w-72 p-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={() => setRoom(roomInputRef.current.value)}
                className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
              >
                Enter Chat
              </button>
            </div>

            {/* 📋 Room List */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2 text-green-800 text-center">
                📁 Available Rooms:
              </h3>
              <ul className="flex flex-wrap justify-center gap-2">
                {allRooms.length === 0 ? (
                  <li className="text-gray-500">No rooms found</li>
                ) : (
                  allRooms.map((roomName) => (
                    <li
                      key={roomName}
                      onClick={() => setRoom(roomName)}
                      className="cursor-pointer bg-white border border-green-400 px-3 py-1 rounded-full text-green-700 text-sm hover:bg-green-100 transition"
                    >
                      {roomName}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <Chatro room={room} />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setRoom(null)}
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
              >
                🔙 Leave Room
              </button>
            </div>
          </>
        )}
      </div>

      {/* 📊 Right: Dashboard Section */}
      <div className="lg:w-1/2 w-full p-6 flex flex-col gap-4 overflow-y-auto bg-green-50">
        <h1 className="text-2xl font-bold text-green-700 text-center">
          🌦️ Smart Farmer Dashboard
        </h1>

        <LocationPicker onLocationSelect={setCoords} />

        {coords && (
          <>
            <WeatherApp lat={coords.lat} lon={coords.lng} />
            <CropPredictor
              setCropDrop={setCrop}
              lat={coords.lat}
              lon={coords.lng}
            />
            <Graphs lat={coords.lat} lon={coords.lng} crop={crop} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
