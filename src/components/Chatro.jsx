import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";

const Chatro = ({ room }) => {
  const msgRef = collection(db, "chatrooms", room, "messages");
  const [messages, setMessages] = useState([]);
  const [newMsg, setMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const queryMsg = query(msgRef, orderBy("createAt"));
    const unsub = onSnapshot(queryMsg, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(msgs);

      // Auto scroll to latest message
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    return () => unsub();
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed) return;

    await addDoc(msgRef, {
      text: trimmed,
      createAt: serverTimestamp(),
      user: auth.currentUser?.displayName || "Anonymous",
    });

    setMsg("");
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden border border-green-300">
      <header className="bg-green-600 text-white py-4 px-6 text-xl font-bold text-center">
        🌱 Chatroom: <span className="italic">{room}</span>
      </header>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
        {messages.map((msg) => (
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
    </div>
  );
};

export default Chatro;
