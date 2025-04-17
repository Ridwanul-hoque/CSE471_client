import React from 'react';
import Banner from './Banner/Banner';
import Adoption from '../adoption/adoption';
import RecentAdoptions from './RecentAdoption/RecentAdoption';


const Home = () => {
    return (
        <div className='bg-white'>
            <Banner></Banner>
            <RecentAdoptions></RecentAdoptions>
            
        </div>
    );
};

export default Home;