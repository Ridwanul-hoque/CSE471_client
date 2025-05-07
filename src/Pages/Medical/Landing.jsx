import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import SparkleEffect from '../Shared/SparklelEffect/SparkleEffect';

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

    <>
      <div>
        <SparkleEffect count={30} />
      </div>
      <div className="min-h-screen bg-gradient-to-r from-[#FFD6BE] via-[#FFE8DA] to-[#FFD6BE] flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#840B36] mb-4">
            24/7 Pet Care at Your Fingertips!
          </h1>
          <p className="text-[#840B36] text-lg md:text-xl">
            Get expert veterinary advice, medicine availability, and chatbot support anytime, anywhere!
          </p>
        </div>

        <div className="w-full flex justify-center">
          <Link
            to="/vet-profiles"
            className="p-8 bg-white border-2 border-[#FFD6BE] shadow-lg hover:shadow-2xl rounded-3xl transform transition duration-300 hover:scale-105 w-full max-w-md"
          >
            <h2 className="text-3xl font-bold text-[#840B36] mb-3 text-center">
              Professional Vets
            </h2>
            <p className="text-[#840B36] text-center text-lg">
              Meet our verified veterinary professionals ready to help your pet.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Landing;
