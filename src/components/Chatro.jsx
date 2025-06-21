import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 

const Chatro = ({ room }) => {
  const msgRef = collection(db, "chatrooms", room, "messages");
  const roomCollectionRef = collection(db, "chatrooms");

  const [messages, setMessages] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMsg, setMsg] = useState("");
  const bottomRef = useRef(null);

  // Fetch Messages for Current Room
  useEffect(() => {
    const queryMsg = query(msgRef, orderBy("createAt"));
    const unsub = onSnapshot(queryMsg, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(msgs);
      
    });
    return () => unsub();
  }, [room, msgRef]);

  useEffect(() => {
    const fetchRooms = async () => {
      const snapshot = await getDocs(roomCollectionRef);
      setAllRooms(snapshot.docs.map((doc) => doc.id));
    };
    fetchRooms();
  }, [roomCollectionRef]);


const handleSubmit = async (e) => {
  e.preventDefault();
  const trimmed = newMsg.trim();
  if (!trimmed) return;

  // 🔒 Ensure chatroom exists with `name` field
  const roomRef = doc(db, "chatrooms", room); 
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    // 🚀 If the chatroom doesn't exist, create it
    await setDoc(roomRef, {
      name: room,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Created chatroom: ${room}`);
  }

  // 💬 Add the message
  await addDoc(msgRef, {
    text: trimmed,
    createAt: serverTimestamp(),
    user: auth.currentUser?.displayName || "Anonymous",
  });

  setMsg("");
};
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden border border-green-300">
      <header className="bg-green-600 text-white py-4 px-6 text-xl font-bold text-center">
        🌱 Chatroom: <span className="italic">{room}</span>
      </header>

      {/* 🔍 Search Messages */}
      <div className="p-2 bg-green-50 border-b border-green-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
          className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.user === auth.currentUser?.displayName
                ? "items-end"
                : "items-start"
            }`}
          >
            <span className="text-sm text-gray-500">{msg.user}</span>
            <div
              className={`px-4 py-2 rounded-xl max-w-xs break-words ${
                msg.user === auth.currentUser?.displayName
                  ? "bg-green-300 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* ✍️ Send Message */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 border-t border-gray-300 bg-white"
      >
        <input
          value={newMsg}
          onChange={(e) => setMsg(e.target.value)}
          type="text"
          className="flex-1 p-2 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
        >
          Send
        </button>
      </form>

      {/* 📜 All Available Rooms */}
      <div className="bg-green-100 p-3 text-sm border-t border-green-300 overflow-y-auto max-h-32">
        <h3 className="font-semibold mb-2 text-green-800">📁 Available Rooms:</h3>
        <ul className="flex flex-wrap gap-2">
          {allRooms.map((roomName) => (
            <li
              key={roomName}
              className="bg-white border border-green-400 px-3 py-1 rounded-full text-green-700 text-xs"
            >
              {roomName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chatro;
