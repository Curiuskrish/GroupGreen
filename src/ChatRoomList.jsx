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
        setError("Failed to load chat rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading chat rooms...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (roomNames.length === 0) {
    return <div>No chat rooms available.</div>;
  }

  return (
    <div className="chat-room-list">
      <h2>Available Chatrooms 🗣️</h2>
      <ul>
        {roomNames.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;