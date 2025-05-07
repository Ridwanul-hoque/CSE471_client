import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';

const AdoptForm = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    adopterName: '',
    adopterPhone: '',
    adopterAddress: '',
  });
  const navigate = useNavigate();

  const { user } = useAuth(); // Access the logged-in user's information

  useEffect(() => {
    fetch(`https://pawkie-server.vercel.app/api/adopt`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setPet(found);
      });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...petWithoutId } = pet;

    const adoptedPet = {
      ...petWithoutId,
      adopterName: form.adopterName,
      adopterPhone: form.adopterPhone,
      adopterAddress: form.adopterAddress,
      status: false,
      adopterEmail: user?.email
    };

    const res = await fetch('https://pawkie-server.vercel.app/api/adoptedPets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adoptedPet),
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Adoption Successful',
        text: 'Adoption submitted successfully!'
      });
      navigate('/adoption');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong while submitting.'
      });
    }
  };

  if (!pet) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold text-[#840B36] mb-6">Adopt {pet.petName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#840B36] font-semibold">Your Name</label>
          <input
            type="text"
            name="adopterName"
            required
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-[#840B36] font-semibold">Phone Number</label>
          <input
            type="text"
            name="adopterPhone"
            required
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-[#840B36] font-semibold">Address</label>
          <input
            type="text"
            name="adopterAddress"
            required
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-[#840B36] text-white px-6 py-2 rounded hover:bg-[#BA6C7D]"
        >
          Confirm Adoption
        </button>
      </form>
    </div>
  );
};

export default AdoptForm;
