import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';
import axios from 'axios';
import DoctorProfile from '../../Medical/DoctorProfile';

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

  const [existingDoctor, setExistingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch doctor data based on user email
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
        const doctor = response.data.find(d => d.email === user?.email);
        setExistingDoctor(doctor || null);
      } catch (err) {
        console.error('Failed to fetch doctor data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [user?.email]);

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

    const imageData = new FormData();
    imageData.append('image', formData.image);

    try {
      const imgResponse = await axios.post(image_hosting_api, imageData);
      const imageUrl = imgResponse.data.data.url;

      const doctorInfo = {
        name: formData.name,
        institution: formData.institution,
        graduationYear: formData.graduationYear,
        experience: formData.experience,
        image: imageUrl,
        email: user?.email,
      };

      await axios.post('http://localhost:5000/doctors', doctorInfo);
      alert('Doctor info added successfully!');
      setExistingDoctor(doctorInfo); // Prevent resubmission
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Something went wrong');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      {!existingDoctor ? (
        <>
          <h2 className="text-xl font-bold mb-4">Add Doctor Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block">Name:</label>
              <input type="text" name="name" className="border w-full p-2" onChange={handleChange} required />
            </div>

            <div className="mb-2">
              <label className="block">Education Institution:</label>
              <input type="text" name="institution" className="border w-full p-2" onChange={handleChange} required />
            </div>

            <div className="mb-2">
              <label className="block">Graduation Year:</label>
              <input type="number" name="graduationYear" className="border w-full p-2" onChange={handleChange} required />
            </div>

            <div className="mb-2">
              <label className="block">Experience (Years):</label>
              <input type="number" name="experience" className="border w-full p-2" onChange={handleChange} required />
            </div>

            <div className="mb-2">
              <label className="block">Doctor Image:</label>
              <input type="file" name="image" className="border w-full p-2" onChange={handleChange} required />
            </div>

            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </>
      ) : (
        <DoctorProfile doctor={existingDoctor} />
      )}
    </div>
  );
};

export default DoctorInformation;
