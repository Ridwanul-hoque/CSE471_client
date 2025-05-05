import React, { useState, useEffect, useRef } from "react";

const DoctorProfile = () => {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. John Doe",
    specialty: "Veterinary Surgeon",
    experience: "10 years"
  });

  const [patientsQueue, setPatientsQueue] = useState([]);
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false);
  const queueRef = useRef(null);

  // Fetch queue every 5 seconds
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem("access-token");

        const res = await fetch(`http://localhost:5000/api/queue?doctorId=dr-john`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setPatientsQueue(data.map(entry => ({
            id: entry._id,
            name: `${entry.animal} - ${entry.description}`
          })));
        } else {
          console.warn("Unexpected response format from queue API:", data);
        }
      } catch (err) {
        console.error("Error fetching queue", err);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Accept patient and go to video call
  const handleStartCall = async (userId) => {
    const token = localStorage.getItem("access-token");
  
    try {
      const res = await fetch("http://localhost:5000/api/queue/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: "dr-john",
          userId
        })
      });
  
      if (res.ok) {
        setPatientsQueue(prev => prev.filter(patient => patient.id !== userId));
      } else {
        console.warn("Queue update failed, proceeding anyway.");
      }
  
    } catch (err) {
      console.error("Failed to start call:", err);
    }
  
    // ✅ Always redirect to call page
    window.location.href = "/doctorvideocall";
  };

  // Submit prescription
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!prescription.trim()) {
      alert("Please write a prescription before submitting.");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting prescription:", prescription);
      alert("Prescription submitted successfully!");
      setPrescription("");
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Failed to submit prescription.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-[#49312C] mb-6">Welcome, {doctorInfo.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Doctor Profile</h2>
              <p><strong>Specialty:</strong> {doctorInfo.specialty}</p>
              <p><strong>Experience:</strong> {doctorInfo.experience}</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Patients in Video Call Queue</h2>
              <div ref={queueRef} className="h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {patientsQueue.map(patient => (
                    <li 
                      key={patient.id}
                      onClick={() => handleStartCall(patient.id)}
                      className="p-2 bg-white rounded shadow-sm hover:bg-gray-200 cursor-pointer"
                    >
                      {patient.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Video Call Area</h2>
              <div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center">
                [ Video Call Streaming Here ]
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Prescription Box</h2>
            <form onSubmit={handlePrescriptionSubmit} className="flex flex-col flex-grow">
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="flex-grow p-4 border rounded-lg bg-white text-[#49312C] placeholder-gray-400"
                placeholder="Write prescription here..."
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
      </div>
    </div>
  );
};

export default DoctorProfile;
