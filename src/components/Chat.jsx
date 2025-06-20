// src/components/Chat.jsx
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
    });

    setMessage('');
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChat(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-[50vh] bg-gray-100 flex flex-col">
      <div className="p-4 text-2xl font-bold bg-indigo-600 text-white text-center shadow">
        Green Chat 💬
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg) => (
          <div key={msg.id} className="bg-white px-4 py-2 rounded shadow w-fit max-w-md">
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex p-4 bg-white shadow">
        <input
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-r hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
