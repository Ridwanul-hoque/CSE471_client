import React from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';


const Main = () => {
    return (
        <div>
            <div className='bg-[#F7B385]'>
                <Navbar></Navbar>
            </div>
            <Outlet></Outlet>
            <div className='bg-[#F7B385]'>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default Main;