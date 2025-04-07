import React from 'react';
import Banner from './Banner/Banner';
import Adoption from './Adoption/Adoption';

const Home = () => {
    return (
        <div className='bg-white'>
            <Banner></Banner>
            <Adoption></Adoption>
        </div>
    );
};

export default Home;