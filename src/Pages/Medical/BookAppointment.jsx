import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProviders";
import Swal from 'sweetalert2';

export const BookAppointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const doctorEmail = location.state?.doctorEmail;

  const [formData, setFormData] = useState({
    petName: '',
    petAge: '',
    problem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queuePayload = {
      email: user?.email,
      doctorEmail,
      ...formData,
      status: 'waiting'
    };

    try {
      const res = await fetch("https://pawkie-server.vercel.app/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        body: JSON.stringify(queuePayload)
      });

      const result = await res.json();
      if (res.ok) {
        navigate("/video-call");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: result.message || "Something went wrong"
        });
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while submitting the form.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFE8DA] via-[#FFD6BE] to-[#FFE3D0] flex flex-col items-center justify-center px-4 py-12">
      <h2 className="text-2xl font-bold text-center text-[#49312C] mb-6">Enter Your Pet's Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet's Name</label>
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white text-[#49312C] placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet's Age</label>
          <input
            type="number"
            name="petAge"
            value={formData.petAge}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white text-[#49312C] placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Describe the problem</label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white text-[#49312C] placeholder-gray-400"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          onClick={async () => {
            try {
              const userEmail = user?.email;

              // Fetch users and find the one with the logged-in email
              const userRes = await fetch("https://pawkie-server.vercel.app/users");
              const users = await userRes.json();
              let matchedUser = users.find(u => u.email === userEmail);

              if (!matchedUser) {
                Swal.fire({
                  icon: 'error',
                  title: 'User Not Found',
                  text: 'User not found in database.'
                });
                return;
              }

              // Check IPO status
              if (matchedUser.IPO === true) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Access Denied',
                  text: 'IPO status is true.'
                });
                return;
              }

              // Fetch links and find one that matches the user's _id
              const linkRes = await fetch("https://pawkie-server.vercel.app/api/links");
              const links = await linkRes.json();
              const userLink = links.find(link => link.userId === matchedUser._id);

              if (!userLink) {
                Swal.fire({
                  icon: 'error',
                  title: 'No Link Found',
                  text: 'No video call link found for this user.'
                });
                return;
              }

              // Open the link in a new tab
              window.open(userLink.link, "_blank");

              // Update IPO status in the backend
              await fetch(`https://pawkie-server.vercel.app/users/IPO`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: matchedUser._id,
                  IPO: true
                }),
              });

            } catch (error) {
              console.error("Error fetching user link:", error);
              Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Something went wrong while trying to open the link.'
              });
            }
          }}
          className="w-full bg-[#49312C] text-[#F7B385] font-bold py-2 rounded-lg hover:bg-[#F7B385] hover:text-[#49312C]"
        >
          Proceed to Call
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
