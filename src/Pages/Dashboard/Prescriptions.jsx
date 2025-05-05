import React, { useEffect, useState } from "react";

const UserPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const response = await fetch("http://localhost:5000/api/prescriptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions(); // Always fetch since we aren't filtering by user anymore
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Prescriptions</h2>
      {prescriptions.length > 0 ? (
        <ul className="space-y-4">
          {prescriptions.map((prescription, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <p><strong>Doctor ID:</strong> {prescription.doctorId}</p>
              <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleString()}</p>
              <p><strong>Prescription:</strong> {prescription.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No prescriptions found.</p>
      )}
    </div>
  );
};

export default UserPrescriptions;
