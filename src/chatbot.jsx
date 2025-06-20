// ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';

const API_KEY = "AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M"; // Replace with ENV var in prod

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom whenever a new message is added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const askGemini = async (topic) => {
    const defaultPrompt = `respond to give ${topic}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: defaultPrompt
          }]
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
    <div className="max-w-2xl mx-auto mt-4 flex flex-col border rounded-lg shadow-lg p-4 h-[80vh]">
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-2 mb-4 p-2 border rounded bg-gray-100"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-xl max-w-[80%] whitespace-pre-wrap ${
              msg.from === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-300 text-black self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          ref={textareaRef}
          className="border rounded p-2 mb-2 resize-none h-24"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your crops..."
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
