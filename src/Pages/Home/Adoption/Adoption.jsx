import React, { useEffect, useState } from 'react';
import AdoptionCard from '../../Shared/AdoptionCard/AdoptionCard';
import { Link } from 'react-router-dom';

const Adoption = () => {
    const [adoptions, setAdoption] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/animal')
            .then(res => res.json())
            .then(data => {
                const featuredAnimal = data.filter(item => item.visibility === 'featured');
                setAdoption(featuredAnimal);
            })
            .catch((error) => console.error('Error fetching bios:', error));
    }, []);
    return (
        <div className="mb-12 p-6 bg-gray-50 max-w-screen-xl mx-auto my-8">
            <h2 className="text-[#49312C] text-3xl font-semibold text-center mb-8">Featured Pets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {adoptions.map(item => (
                    <AdoptionCard key={item._id} item={item} />
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <Link to={"/BioData"} className="px-6 py-2 bg-[#F7B385] text-[#49312C] font-semibold rounded-lg border-2 border-[#49312C] transform transition duration-300 hover:bg-transparent hover:text-[#49312C] hover:border-[#F7B385]">
                    View All Pets
                </Link>
            </div>
        </div>
    );
};

export default Adoption;