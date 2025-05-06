import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProviders";


export const BookAppointment = () => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
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
      ...formData
    };

    try {
      const res = await fetch("http://localhost:5000/api/queue", {
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
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center justify-center px-4 py-12">
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
          className="w-full bg-[#49312C] text-[#F7B385] font-bold py-2 rounded-lg hover:bg-[#F7B385] hover:text-[#49312C]"
        >
          Proceed to Call
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
