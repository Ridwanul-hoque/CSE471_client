import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

const Landing = () => {
  const [vetsCount, setVetsCount] = useState(0);

  useEffect(() => {
    const fetchVets = async () => {
      const querySnapshot = await getDocs(collection(db, 'vets'));
      setVetsCount(querySnapshot.size);
    };
    fetchVets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#49312C] mb-4">
          24/7 Pet Care at Your Fingertips!
        </h1>
        <p className="text-[#49312C] text-lg md:text-xl">
          Get expert veterinary advice, medicine availability, and chatbot support anytime, anywhere!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 w-full max-w-6xl">
        <Link to="/vet-profiles" className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-[#49312C] mb-2">Professional Vets</h2>
          <p className="text-[#49312C]">Meet our {vetsCount} verified veterinary professionals ready to help your pet.</p>
        </Link>

        <Link to="/book-appointment" className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-[#49312C] mb-2">Talk to a Vet Now</h2>
          <p className="text-[#49312C]">Instant live video/audio chat with our experts.</p>
        </Link>

        <Link to="/vet-bot" className="relative p-6 bg-white shadow-md rounded-xl hover:shadow-xl transform transition duration-300 hover:scale-105">
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full rotate-12">
            NEW
          </div>
          <h2 className="text-2xl font-bold text-[#49312C] mb-2">Talk to VetBot</h2>
          <p className="text-[#49312C]">Ask questions and get smart AI responses instantly.</p>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
