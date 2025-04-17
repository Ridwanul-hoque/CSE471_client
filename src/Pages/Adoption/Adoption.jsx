import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostAdoptionForm from '../PostAdoptionForm/PostAdoptionForm';
import AllAdoptions from '../AllAdoptions/AllAdoptions';


const PawPrint = () => <span>🐾</span>;

const Adoption = () => {
  const [pets, setPets] = useState([]);

  const fetchPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/adopt");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    setPets(data);
  } catch (err) {
    console.error("Failed to fetch pets:", err);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FFE8DA] via-[#FFD6BE] to-[#FFE3D0] flex flex-col lg:flex-row items-start px-6 lg:px-20 space-y-10">

        {/* 🐾 Left: Form with Image Border */}
        <div className="flex-1 flex justify-center items-center relative" data-aos="fade-right" data-aos-duration="1000">
          <div
            className="p-6 md:p-10 bg-no-repeat bg-center bg-contain"
            style={{
              backgroundImage: "url('https://i.ibb.co.com/tTCyfpXp/form-pic-2.png')",
              backgroundSize: "100% 100%",
              width: '100%',
              maxWidth: '600px',
              maxHeight: '700px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="w-full px-10 md:px-6 pt-108">
              {/* ✅ Pass callback to form */}
              <PostAdoptionForm onSubmitSuccess={fetchPosts} />
            </div>
          </div>
        </div>

        {/* 🐾 Right: Text Section */}
        <div className="flex-1 text-left lg:pl-20 xl:pl-1 pt-60 max-w-xl" data-aos="fade-left" data-aos-duration="1000">
          <p className="text-2xl text-[#804a3b] mb-2 font-medium">Every paw deserves a loving home!</p>
          <h1 className="text-7xl font-extrabold text-[#49312C] leading-tight mb-4">
            FIND YOUR <br className="hidden lg:block" /> COMPANION
          </h1>
          <p className="text-l text-[#6B3F33] leading-relaxed mb-6">
            Every pet deserves love, care, and a forever home. <br />
            Adopt a furry friend or help one find a new family —<br />
            safe, trusted, and full of love!
          </p>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="w-full overflow-hidden bg-[#FFFFFF]">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-32 md:h-40 lg:h-52" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FFE8DA" />
              <stop offset="50%" stopColor="#FFD6BE" />
              <stop offset="100%" stopColor="#FFE3D0" />
            </linearGradient>
            <filter id="waveShadow">
              <feDropShadow dx="0" dy="-2" stdDeviation="4" floodColor="#f7b385" floodOpacity="0.5" />
            </filter>
          </defs>
          <path
            fill="url(#grad1)"
            filter="url(#waveShadow)"
            d="M0,224L48,208C96,192,192,160,288,133C384,107,480,85,576,112C672,139,768,213,864,224C960,235,1056,181,1152,176C1248,171,1344,213,1392,234L1440,256L1440,0L0,0Z"
          />
        </svg>
      </div>

      {/* ✅ Show adoption posts */}
      <div className="w-full">
        <AllAdoptions pets={pets} />
      </div>
    </>
  );
};

export default Adoption;
