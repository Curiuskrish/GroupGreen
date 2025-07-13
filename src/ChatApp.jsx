// ChatApp.jsx
import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Chatro from "./components/Chatro";
import UserList from "./UserList";

const ChatApp = () => {
  const [room, setRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [language, setLanguage] = useState("English");
  const roomInputRef = useRef(null);

  // 🔄 Fetch all room names
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomRef = collection(db, "chatrooms");
        const snapshot = await getDocs(roomRef);
        const roomNames = snapshot.docs.map(doc => doc.id);
        setAllRooms(roomNames);
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-green-50 text-gray-800">
      {/* 🔧 Left Section: Room Creation + List + User List */}
      <div className="lg:w-1/3 w-full p-6 bg-white shadow-md space-y-6">
        {/* 🌾 Room Input */}
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

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">Language:</label>
            <input
              onChange={(e) => setLanguage(e.target.value)}
              type="text"
              value={language}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        {/* 🗂 Available Rooms */}
        <div>
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

        {/* 👥 Firebase User List (sets room) */}
        <div>
          <UserList setRoom={setRoom} />
        </div>
      </div>

      {/* 💬 Right Section: Chat UI */}
      <div className="flex-1 p-6 bg-green-100">
        {room ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">
                🔒 Room: {room}
              </h2>
              <button
                onClick={() => setRoom(null)}
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
              >
                🔙 Leave Room
              </button>
            </div>
            <Chatro room={room} language={language} />
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20 text-lg">
            👈 Select or enter a room to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
