import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const API_KEY = "AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M"; // Replace in prod

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const askGemini = async (topic) => {
    const defaultPrompt = `respond to give ${topic} ,give response only in ${language} language`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: defaultPrompt }]
        }]
      })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response 😢";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    setMessages((prev) => [...prev, { from: 'user', text: value }]);
    setInput('');
    const reply = await askGemini(`answer this question: ${value}`);
    setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        e.preventDefault();
        const cursor = textareaRef.current.selectionStart;
        const newValue =
          input.substring(0, cursor) + "\n" + input.substring(cursor);
        setInput(newValue);
        setTimeout(() => {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursor + 1;
        }, 0);
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 lg:px-0 flex flex-col h-[85vh] bg-white/70 backdrop-blur-md border border-green-200 shadow-lg rounded-2xl overflow-hidden">
      {/* 💬 Chat Display */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gradient-to-br from-[#f0fef4] to-[#e2f4e8]"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap text-sm md:text-base ${
              msg.from === 'user'
                ? 'bg-green-600 text-white self-end ml-auto'
                : 'bg-green-100 text-green-900 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ✍️ Input Section */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-green-200 bg-white flex flex-col md:flex-row gap-4"
      >
        <textarea
          ref={textareaRef}
          className="flex-1 p-3 border border-green-300 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Ask me anything about your crops..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
