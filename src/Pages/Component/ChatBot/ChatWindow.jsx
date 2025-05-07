import React, { useState } from 'react';
import axios from 'axios';


const ChatWindow = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! Ask me anything about pets 🐶🐱", fromBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, fromBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        console.log("Sending message to backend:", input);  // Log the message being sent

        const response = await axios.post('https://pawkie-server.vercel.app/chat', {
          message: input,
      });

        console.log("Bot's response:", response.data.reply);  // Log the bot's response

        const botMessage = { text: response.data.reply, fromBot: true };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Error in sending message:", error);
        setMessages((prev) => [...prev, { text: "Sorry, I couldn't respond.", fromBot: true }]);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="fixed bottom-24 right-6 w-80 h-100 bg-white border shadow-lg rounded-lg z-50 flex flex-col">
      <div className="bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] text-white p-4 font-semibold rounded-t-lg flex justify-between items-center">
        <h1> 
        <img 
              src="src/assets/logo_2.png" 
              alt="Logo" 
              className="h-8 md:h-8 inline-block -mt-2 md:-mt-4 mr-2"
            />Pet-AI
        </h1>
        <button onClick={closeChat} className="text-white text-xl">&times;</button>
      </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80">
          {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.fromBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-2 rounded-md ${msg.fromBot ? 'bg-[#F1F1F1] text-gray-800' : 'bg-[#840B36] text-white'} max-w-[75%]`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="bg-[#F1F1F1] text-gray-800 p-2 rounded-md self-start max-w-[75%]">
            Typing...
          </div>
        )}
      </div>
      <div className="flex items-center p-2 border-t">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 border rounded-lg mr-2"
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend}
          className="bg-[#840B36] text-white px-4 py-2 rounded-lg hover:bg-[#A24C60]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
