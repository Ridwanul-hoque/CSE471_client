import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';
import axios from 'axios';
import DoctorProfile from '../../Medical/DoctorProfile';
import Swal from 'sweetalert2';

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

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get('https://pawkie-server.vercel.app/doctors');
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

      await axios.post('https://pawkie-server.vercel.app/doctors', doctorInfo);

      Swal.fire({
        icon: 'success',
        title: 'Doctor Info Added',
        text: 'Doctor info added successfully!'
      });

      setExistingDoctor(doctorInfo);
    } catch (error) {
      console.error('Error uploading data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Something went wrong while submitting the doctor info.'
      });
    }
  };

  if (loading) return <p className="text-center text-[#5F040D] font-medium">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-[#FFE8DA] shadow-lg rounded-2xl border border-[#FFD6BE]">
      {!existingDoctor ? (
        <>
          <h2 className="text-2xl font-bold text-[#5F040D] mb-6 text-center">Add Doctor Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Education Institution', name: 'institution', type: 'text' },
              { label: 'Graduation Year', name: 'graduationYear', type: 'number' },
              { label: 'Experience (Years)', name: 'experience', type: 'number' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-[#5F040D] font-semibold">{label}:</label>
                <input
                  type={type}
                  name={name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded border border-[#FFD6BE] focus:outline-none focus:ring-2 focus:ring-[#9C3346]"
                />
              </div>
            ))}

            <div>
              <label className="block text-[#5F040D] font-semibold">Doctor Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                required
                className="w-full p-2 rounded border border-[#FFD6BE] bg-white"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#5F040D] hover:bg-[#9C3346] text-white px-6 py-2 rounded-full shadow-md transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      ) : (
        <DoctorProfile doctor={existingDoctor} />
      )}
    </div>
  );
};

export default DoctorInformation;
