// 4. VetBot Page (Chat Interface)
import React, { useState } from "react";

export const VetBot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! I’m VetBot 🐾. How can I help your pet today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }, { from: "bot", text: "Thank you for your question! A vet will respond shortly." }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#49312C]">Talk to VetBot <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded transform rotate-6">NEW</span></h2>
      <div className="h-96 overflow-y-auto border p-4 rounded-lg bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.from === "user" ? "bg-[#F7B385] text-white" : "bg-[#49312C] text-white"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-l-lg bg-white text-[#49312C] placeholder-gray-400"
          placeholder="Ask VetBot something..."
        />
        <button
          type="submit"
          className="bg-[#49312C] text-[#F7B385] px-6 py-2 rounded-r-lg hover:bg-[#F7B385] hover:text-[#49312C]"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default VetBot;