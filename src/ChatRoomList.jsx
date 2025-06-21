import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const ChatRoomList = () => {
  const [roomNames, setRoomNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "chatrooms"));
        const names = querySnapshot.docs.map(doc => doc.id);
        setRoomNames(names);
        setError(null);
      } catch (error) {
        console.error("Error fetching room names:", error);
        setError("⚠️ Failed to load chat rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white/70 backdrop-blur-md shadow-md rounded-2xl border border-green-200 text-[#1f3b29]">
      <h2 className="text-2xl font-semibold mb-4 text-green-800 text-center">
        🗣️ Available Chatrooms
      </h2>

      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          ⏳ Loading chat rooms...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-medium">
          {error}
        </div>
      )}

      {!loading && !error && roomNames.length === 0 && (
        <div className="text-center text-gray-600">
          😕 No chat rooms available.
        </div>
      )}

      {!loading && !error && roomNames.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-3 mt-4">
          {roomNames.map(name => (
            <li
              key={name}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-full shadow-sm hover:bg-green-200 cursor-default transition"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;
