import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className="hero min-h-screen bg-gradient-to-r from-[#FFE8DA] via-[#FFD6BE] to-[#FFE3D0]">
            <div className="hero-content flex flex-col-reverse lg:flex-row items-center gap-12 px-6 lg:px-12">
                <div className="text-center lg:text-left max-w-xl">
                    <h1 className="text-5xl font-bold text-[#49312C]">Every paw deserves a loving home!</h1>
                    <p className="py-4 text-lg text-[#6B3F33]">FIND YOUR COMPANION</p>
                    <p className="py-2 text-[#6B3F33]">
                        Every pet deserves love, care, and a forever home. Adopt a furry friend or help one find a new family—safe, trusted, and full of love!
                    </p>
                    <Link to="/adoption" className="btn bg-[#F7B385] text-[#49312C] border-0 mt-4 hover:brightness-110 transition">POST ADOPTION</Link>
                </div>
                <img
                    src="https://i.ibb.co.com/gLs3SB8K/PIC-2.png"
                    className="max-w-md w-full rounded-lg shadow-xl"
                    alt="Cute pet" />
            </div>
        </div>
    );
};

export default Banner;
