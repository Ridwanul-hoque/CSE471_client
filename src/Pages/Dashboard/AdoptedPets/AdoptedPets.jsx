import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { motion } from 'framer-motion';
import useAuth from '../../../Hooks/useAuth';

const AdoptedPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      try {
        const res = await axios.get('https://pawkie-server.vercel.app/api/adoptedPets');
        const filtered = res.data.filter(
          (pet) => pet.adopterEmail === user?.email && pet.status === true
        );
        setPets(filtered);
      } catch (error) {
        console.error('Failed to fetch adopted pets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchAdoptedPets();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (pets.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No adopted pets found for your account.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <motion.div
          key={pet._id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          whileHover={{ scale: 1.03 }}
        >
          <img
            src={`https://pawkie-server.vercel.app${pet.images[0]}`}
            alt={pet.petName}
            className="w-full h-56 object-cover"
          />
          <div className="p-5 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">{pet.petName} ({pet.petBreed})</h2>
            <p className="text-sm text-gray-500">Color: {pet.petColor} | Age: {pet.petAge}</p>
            <div className="mt-3 border-t pt-3">
              <h3 className="font-medium text-gray-700">Owner Info</h3>
              <p className="text-sm text-gray-600">Name: {pet.ownerName}</p>
              <p className="text-sm text-gray-600">Phone: {pet.contact}</p>
              <p className="text-sm text-gray-600">Address: {pet.address}</p>
            </div>
            <div className="mt-3 border-t pt-3">
              <h3 className="font-medium text-gray-700">Adoption Info</h3>
              <p className="text-sm text-gray-600">Your Name: {pet.adopterName}</p>
              <p className="text-sm text-gray-600">Your Phone: {pet.adopterPhone}</p>
              <p className="text-sm text-gray-600">Your Address: {pet.adopterAddress}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdoptedPets;
