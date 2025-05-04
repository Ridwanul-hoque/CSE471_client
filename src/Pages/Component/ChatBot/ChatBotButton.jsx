import React, { useState, useEffect } from 'react';
import ai from '../../../assets/ai.png'

const ChatBotButton = ({ toggleChat }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Pulse animation effect every few seconds
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 3000);
    }, 7000);
    
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <button
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 bg-gradient-to-r from-[#FFD6BE] via-[#FFE8DA] to-[#FFD6BE] hover:bg-blue-100 border-[#5F040D] border-2 w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl transition-all duration-500 ease-in-out z-50 ${
        isAnimating ? 'scale-110 shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
      title="Chat with us"
    >
      <div className="relative">
        <img
          src={ai}
          alt="Paw"
          className={`h-8 w-auto transition-transform duration-500 ease-in-out ${
            isAnimating ? 'scale-110 rotate-12' : ''
          }`}
        />
        
        {/* Ripple effect circles */}
        <div className={`absolute inset-0 rounded-full border-4 border-[#FFD6BE] animate-ping opacity-50 ${
          isAnimating ? 'scale-150' : 'scale-0'
        }`}></div>
        
        <div className={`absolute inset-0 rounded-full border-2 border-[#5F040D] animate-ping opacity-30 ${
          isAnimating ? 'scale-130' : 'scale-0'
        }`}></div>

        <div className={`absolute inset-0 rounded-full border-2 border-[#FFD6BE] animate-ping opacity-20 ${
          isAnimating ? 'scale-120' : 'scale-0'
        }`}></div>
      </div>
    </button>
  );
};

export default ChatBotButton;