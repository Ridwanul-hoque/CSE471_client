import React, { useEffect, useState, useContext } from "react";

import axios from "axios";
import { AuthContext } from "../../../Providers/AuthProviders";

const UserPrescriptions = () => {
  const { user } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const [usersRes, prescriptionsRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/api/prescriptions")
        ]);

        const matchedUser = usersRes.data.find(u => u.email === user.email);

        if (!matchedUser) {
          setPrescriptions([]);
          return;
        }

        const userPrescriptions = prescriptionsRes.data.filter(
          p => p.userId === matchedUser._id
        );

        setPrescriptions(userPrescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user.email]);

  if (loading) return <p>Loading prescriptions...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {prescriptions.map((prescription) => (
        <div
          key={prescription._id}
          className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-2">Pet: {prescription.petName}</h2>
          <p className="text-gray-700 mb-1">
            <strong>Doctor Email:</strong> {prescription.doctorEmail}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Prescription:</strong> {prescription.prescription}
          </p>
          <p className="text-gray-500 text-sm">
            <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserPrescriptions;
