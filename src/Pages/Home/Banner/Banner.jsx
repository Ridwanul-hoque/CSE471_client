import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className="hero bg-[#FFE3D0] min-h-screen">
            <div className="hero-content flex justify-between ">
                <img
                    src="https://i.ibb.co.com/gLs3SB8K/PIC-2.png"
                    className="max-w-lg rounded-lg shadow-2xl mr-12" />
                <div>
                    <h1 className="text-5xl font-bold text-center">Every paw deserves a loving home!</h1>
                    <p className="py-6 text-center">
                        FIND YOUR
                        COMPANION
                    </p>
                    <p className="py-6 text-center">
                        Every pet deserves love, care, and a forever home. Adopt a furry friend or help one find a new family—safe, trusted, and full of love!
                    </p>
                    <Link to="/adoption" className="btn bg-[#F7B385]">POST ADOPTION</Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;