import React, { useState } from 'react';
import Banner from './Banner/Banner';
import Adoption from '../adoption/adoption';
import RecentAdoptions from './RecentAdoption/RecentAdoption';
import ChatBotButton from '../Component/ChatBot/ChatBotButton';
import ChatWindow from '../Component/ChatBot/ChatWindow';
import { Link } from 'react-router-dom';


const Home = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => setIsChatOpen(!isChatOpen);
    return (
        <div className='bg-[#F8F9FA] relative'>
            <Banner></Banner>
            <RecentAdoptions></RecentAdoptions>
            {/* View More Button */}
            <div className="flex justify-center my-10">
                <Link to="/adoption">
                    <button className=" cursor-pointer bg-[#840B36] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A24C60] transition">
                        View More
                    </button>
                </Link>
            </div>

            {/* Chatbot */}
            <ChatBotButton toggleChat={toggleChat} />
            {isChatOpen && <ChatWindow closeChat={toggleChat} />}

        </div>
    );
};

export default Home;