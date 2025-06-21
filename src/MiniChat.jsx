import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const API_KEY = "AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M"; // ⚠️ Move to .env in production

const MiniChat = () => {
  const { language } = useLanguage();
  const chatRef = useRef(null);

  const baseMessages = [
    { from: 'user', text: "How to grow tomatoes?" },
    { from: 'bot', text: "Use rich soil and ensure sunlight ☀️" },
  ];

  const [messages, setMessages] = useState([...baseMessages]);
  const [input, setInput] = useState("");

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch Gemini reply
  const askGemini = async (question) => {
    const prompt = `Answer this in a helpful way in ${language}: ${question}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      });

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 No response.";
    } catch (err) {
      console.error("Gemini Error:", err);
      return "⚠️ Failed to fetch response.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const botReply = await askGemini(trimmed);
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-white rounded-xl shadow-lg p-4 space-y-3">
      {/* 💬 Chat Window */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-2 p-2 bg-[#2b2b2b] rounded-md border border-gray-700 max-h-[300px] scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-md text-sm max-w-[85%] whitespace-pre-wrap leading-relaxed ${
              msg.from === "user"
                ? "bg-green-600 text-white self-end ml-auto"
                : "bg-gray-700 text-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ✍️ Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-md bg-[#121212] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
          placeholder="Ask something like 'How to grow sugarcane?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MiniChat;
