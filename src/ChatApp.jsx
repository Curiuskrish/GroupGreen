import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import Chatro from "./components/Chatro";
import UserList from "./UserList";

const ChatApp = () => {
  const [room, setRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [language, setLanguage] = useState("English");
  const [vendors, setVendors] = useState([]);
  const roomInputRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomRef = collection(db, "chatrooms");
        const snapshot = await getDocs(roomRef);
        setAllRooms(snapshot.docs.map(doc => doc.id));
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const vendorList = snapshot.docs
          .map(doc => doc.data())
          .filter(user => user.role === "vendor");
        setVendors(vendorList);
      } catch (err) {
        console.error("❌ Failed to fetch vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#f0fef4] via-[#e6f7ef] to-[#d0f2e3] text-[#1f3b29]">
      {/* Left Panel */}
      <div className="lg:w-1/3 w-full p-6 bg-white/70 backdrop-blur-md shadow-xl border-r border-green-200 space-y-6">
        {/* Room Creation */}
        <div className="text-center">
          <label className="text-xl font-semibold text-green-800 mb-2 block">
            🌾 Enter Room Name
          </label>
          <input
            ref={roomInputRef}
            type="text"
            placeholder="Ex: cotton-telangana"
            className="w-full p-3 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={() => setRoom(roomInputRef.current.value)}
            className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            Enter Chat
          </button>
          <div className="mt-4 text-left">
            <label className="text-sm font-medium text-gray-600">Language:</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Available Rooms */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-2 text-center">
            📁 Available Rooms:
          </h3>
          <ul className="flex flex-wrap gap-2 justify-center">
            {allRooms.length === 0 ? (
              <li className="text-gray-500">No rooms found</li>
            ) : (
              allRooms.map((roomName) => (
                <li
                  key={roomName}
                  onClick={() => setRoom(roomName)}
                  className="cursor-pointer px-3 py-1 bg-white border border-green-300 rounded-full text-green-700 text-sm hover:bg-green-100 transition"
                >
                  {roomName}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Firebase User List + Vendors */}
        <div className="space-y-4">
          <UserList setRoom={setRoom} />
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              🛍️ Available Vendors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor.uid}
                  onClick={() => setRoom(`chat-${auth.currentUser?.uid}-${vendor.uid}`)}
                  className="cursor-pointer bg-white shadow rounded-xl p-3 hover:bg-green-50 transition"
                >
                  <img
                    src={vendor.photoURL || "https://via.placeholder.com/100"}
                    alt={vendor.name}
                    className="w-14 h-14 object-cover rounded-full mx-auto mb-2"
                  />
                  <p className="text-sm text-center font-medium">{vendor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Chat UI */}
      <div className="flex-1 p-6 bg-white/60 backdrop-blur-md">
        {room ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-green-900">
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
          <div className="flex justify-center items-center h-full text-gray-500 text-lg">
            👈 Select or enter a room to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
