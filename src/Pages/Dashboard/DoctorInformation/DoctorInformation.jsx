import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';
import axios from 'axios';

const DoctorInformation = () => {
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    graduationYear: '',
    experience: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Upload Image to imgbb
    const imageData = new FormData();
    imageData.append('image', formData.image);

    try {
      const imgResponse = await axios.post(image_hosting_api, imageData);
      const imageUrl = imgResponse.data.data.url;

      // Step 2: Send Doctor Data to Backend
      const doctorInfo = {
        name: formData.name,
        institution: formData.institution,
        graduationYear: formData.graduationYear,
        experience: formData.experience,
        image: imageUrl,
        email: user?.email, // optional
      };

      await axios.post('http://localhost:5000/doctors', doctorInfo);
      alert('Doctor info added successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Add Doctor Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            className="border w-full p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Education Institution:</label>
          <input
            type="text"
            name="institution"
            className="border w-full p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Graduation Year:</label>
          <input
            type="number"
            name="graduationYear"
            className="border w-full p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Experience (Years):</label>
          <input
            type="number"
            name="experience"
            className="border w-full p-2"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Doctor Image:</label>
          <input
            type="file"
            name="image"
            className="border w-full p-2"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DoctorInformation;
