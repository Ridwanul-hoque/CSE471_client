import React from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';


const Main = () => {
    return (
        <div>
            <div className='bg-[#F7B385]'>
                <div className='bg-gradient-to-r from-[#49312C] via-[#6B3F33] to-[#49312C] px-4 py-2 rounded-b-2xl'>
                    <Navbar></Navbar>
                </div>
            </div>
            <Outlet></Outlet>
            <div className='bg-[#F7B385]'>
                <div className='bg-gradient-to-r from-[#49312C] via-[#6B3F33] to-[#49312C] px-4 py-2 rounded-b-2xl'>
                    <Footer></Footer>
                </div>
            </div>
        </div>
    );
};

export default Main;