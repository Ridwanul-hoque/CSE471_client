// 1. Doctor Profiles Page
import React from "react";
import { useNavigate } from "react-router-dom";

const doctors = [
  {
    id: 1,
    name: "Dr. Samantha Ray",
    profession: "Veterinary Surgeon",
    photo: "https://i.ibb.co/kBrYqDm/femaledoc1.jpg",
  },
  {
    id: 2,
    name: "Dr. Alex Chen",
    profession: "Pet Nutrition Specialist",
    photo: "https://i.ibb.co/By4W4Lh/maledoc1.jpg",
  },
  {
    id: 3,
    name: "Dr. Ayesha Rahman",
    profession: "General Veterinarian",
    photo: "https://i.ibb.co/PwTgDQJ/femaledoc2.jpg",
  },
];

export const VetProfiles = () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          <h2 className="text-3xl font-bold text-center text-[#49312C] mb-8">Our Veterinary Experts</h2>
          <div className="space-y-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="flex items-center gap-6 p-4 rounded-xl bg-white shadow-md">
                <img src={doc.photo} alt={doc.name} className="w-32 h-32 object-cover rounded-full border-4 border-[#F7B385]" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#49312C]">{doc.name}</h3>
                  <p className="text-gray-600">{doc.profession}</p>
                </div>
                <button
                  className="bg-[#F7B385] text-white px-4 py-2 rounded-lg hover:bg-[#49312C] hover:text-[#F7B385] transition"
                  onClick={() => navigate("/book-appointment")}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default VetProfiles;