import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorVideoCall = () => {
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEndCall = () => {
    navigate("/doctorsprofile");
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
  
    if (!prescription.trim()) {
      alert("Please write a prescription before submitting.");
      return;
    }
  
    setLoading(true);
  
    try {
      const token = localStorage.getItem("access-token"); // If your API is protected
      const user = JSON.parse(localStorage.getItem("user")); // Assuming user info is stored here
  
      const response = await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: user?.id || "doctor-id-placeholder", // Replace with actual doctor ID
          userId: user?.callUserId || "user-id-placeholder", // Replace with the ID of the user in the call
          text: prescription
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit prescription");
      }
  
      const result = await response.json();
      console.log("Prescription submitted:", result);
      alert("Prescription submitted successfully!");
      setPrescription("");
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Failed to submit prescription.");
    }
  
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-10">
      <h2 className="text-3xl font-bold text-[#49312C] mb-6">Live Video Consultation</h2>

      <div className="w-full max-w-4xl aspect-video bg-black rounded-xl shadow-lg relative mb-6">
        <p className="text-white text-center pt-32">[Doctor Video Feed Placeholder]</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="bg-green-500 px-6 py-2 rounded-lg text-white font-semibold">Mic On</button>
        <button className="bg-blue-500 px-6 py-2 rounded-lg text-white font-semibold">Camera On</button>
        <button
          className="bg-red-500 px-6 py-2 rounded-lg text-white font-semibold"
          onClick={handleEndCall}
        >
          End Call
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2 text-[#49312C]">Write Prescription</h3>
        <form onSubmit={handlePrescriptionSubmit} className="flex flex-col">
          <textarea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            rows={6}
            className="border rounded-lg p-4 text-[#49312C] bg-white placeholder-gray-400 resize-none"
            placeholder="Enter prescription details..."
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#49312C] text-[#F7B385] px-6 py-2 rounded-lg hover:bg-[#F7B385] hover:text-[#49312C] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Prescription"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorVideoCall;
