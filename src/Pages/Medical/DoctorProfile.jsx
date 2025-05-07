// // import React, { useState, useEffect, useRef } from "react";

// // const DoctorProfile = () => {
// //   const [doctorInfo, setDoctorInfo] = useState({
// //     name: "Dr. John Doe",
// //     specialty: "Veterinary Surgeon",
// //     experience: "10 years"
// //   });

// //   const [patientsQueue, setPatientsQueue] = useState([]);
// //   const [prescription, setPrescription] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const queueRef = useRef(null);

// //   // Fetch queue every 5 seconds
// //   useEffect(() => {
// //     const fetchQueue = async () => {
// //       try {
// //         const token = localStorage.getItem("access-token");

// //         const res = await fetch(`https://pawkie-server.vercel.app/api/queue?doctorId=dr-john`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         });

// //         const data = await res.json();

// //         if (Array.isArray(data)) {
// //           setPatientsQueue(data.map(entry => ({
// //             id: entry._id,
// //             name: `${entry.animal} - ${entry.description}`
// //           })));
// //         } else {
// //           console.warn("Unexpected response format from queue API:", data);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching queue", err);
// //       }
// //     };

// //     fetchQueue();
// //     const interval = setInterval(fetchQueue, 5000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Accept patient and go to video call
// //   const handleStartCall = async (userId) => {
// //     const token = localStorage.getItem("access-token");

// //     try {
// //       const res = await fetch("https://pawkie-server.vercel.app/api/queue/accept", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           doctorId: "dr-john",
// //           userId
// //         })
// //       });

// //       if (res.ok) {
// //         setPatientsQueue(prev => prev.filter(patient => patient.id !== userId));
// //       } else {
// //         console.warn("Queue update failed, proceeding anyway.");
// //       }

// //     } catch (err) {
// //       console.error("Failed to start call:", err);
// //     }

// //     // ✅ Always redirect to call page
// //     window.location.href = "/doctorvideocall";
// //   };

// //   // Submit prescription
// //   const handlePrescriptionSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!prescription.trim()) {
// //       alert("Please write a prescription before submitting.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       console.log("Submitting prescription:", prescription);
// //       alert("Prescription submitted successfully!");
// //       setPrescription("");
// //     } catch (error) {
// //       console.error("Error submitting prescription:", error);
// //       alert("Failed to submit prescription.");
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-[#F7B385] to-[#FFDAB9] flex flex-col items-center px-4 py-8">
// //       <div className="w-full max-w-6xl">
// //         <h1 className="text-3xl font-bold text-[#49312C] mb-6">Welcome, {doctorInfo.name}</h1>

// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="col-span-2 space-y-4">
// //             <div className="p-6 bg-gray-50 rounded-lg shadow">
// //               <h2 className="text-xl font-semibold mb-2">Doctor Profile</h2>
// //               <p><strong>Specialty:</strong> {doctorInfo.specialty}</p>
// //               <p><strong>Experience:</strong> {doctorInfo.experience}</p>
// //             </div>

// //             <div className="p-6 bg-gray-50 rounded-lg shadow">
// //               <h2 className="text-xl font-semibold mb-2">Patients in Video Call Queue</h2>
// //               <div ref={queueRef} className="h-48 overflow-y-auto">
// //                 <ul className="space-y-2">
// //                   {patientsQueue.map(patient => (
// //                     <li 
// //                       key={patient.id}
// //                       onClick={() => handleStartCall(patient.id)}
// //                       className="p-2 bg-white rounded shadow-sm hover:bg-gray-200 cursor-pointer"
// //                     >
// //                       {patient.name}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             </div>

// //             <div className="p-6 bg-gray-50 rounded-lg shadow">
// //               <h2 className="text-xl font-semibold mb-2">Video Call Area</h2>
// //               <div className="w-full h-64 bg-gray-300 rounded flex items-center justify-center">
// //                 [ Video Call Streaming Here ]
// //               </div>
// //             </div>
// //           </div>

// //           <div className="p-6 bg-gray-50 rounded-lg shadow flex flex-col">
// //             <h2 className="text-xl font-semibold mb-4">Prescription Box</h2>
// //             <form onSubmit={handlePrescriptionSubmit} className="flex flex-col flex-grow">
// //               <textarea
// //                 value={prescription}
// //                 onChange={(e) => setPrescription(e.target.value)}
// //                 className="flex-grow p-4 border rounded-lg bg-white text-[#49312C] placeholder-gray-400"
// //                 placeholder="Write prescription here..."
// //               />
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="mt-4 bg-[#49312C] text-[#F7B385] px-6 py-2 rounded-lg hover:bg-[#F7B385] hover:text-[#49312C] disabled:opacity-50"
// //               >
// //                 {loading ? "Submitting..." : "Submit Prescription"}
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DoctorProfile;






// // import React, { useContext, useEffect, useState } from 'react';
// // import { AuthContext } from '../../Providers/AuthProviders';

// // const DoctorProfile = () => {
// //   const { user } = useContext(AuthContext);
// //   const [queue, setQueue] = useState([]);
// //   const [selectedCase, setSelectedCase] = useState(null);
// //   const [prescriptionText, setPrescriptionText] = useState('');
  

// //   useEffect(() => {
// //     fetch('https://pawkie-server.vercel.app/api/queue')
// //       .then(res => res.json())
// //       .then(data => {
// //         const filtered = data.filter(item => item.doctorEmail === user?.email);
// //         setQueue(filtered);
// //       });
// //   }, [user?.email]);

// //   const handlePrescriptionSubmit = async () => {
// //     if (!selectedCase || !prescriptionText) return;

// //     const prescriptionData = {
// //       userId: selectedCase.userId,
// //       doctorEmail: user.email,
// //       petName: selectedCase.petName,
// //       prescription: prescriptionText,
// //       createdAt: new Date()
// //     };

// //     try {
// //       // Send prescription
// //       await fetch('https://pawkie-server.vercel.app/api/prescriptions', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(prescriptionData)
// //       });

// //       // Delete from queue
// //       await fetch(`https://pawkie-server.vercel.app/api/queue/${selectedCase._id}`, {
// //         method: 'DELETE'
// //       });

// //       // Update UI
// //       setQueue(prev => prev.filter(item => item._id !== selectedCase._id));
// //       setSelectedCase(null);
// //       setPrescriptionText('');
// //     } catch (err) {
// //       console.error('Error handling prescription:', err);
// //     }
// //   };

// //   return (
// //     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
// //       <h2>sdfsdfsdf</h2>
// //       {queue.map((item) => (
// //         <div key={item._id} className="bg-white p-4 rounded-xl shadow-md border">
// //           <h2 className="text-xl font-bold mb-2">{item.petName}</h2>
// //           <p><strong>Age:</strong> {item.petAge}</p>
// //           <p><strong>Problem:</strong> {item.problem}</p>
// //           <p><strong>Status:</strong> {item.status}</p>
// //           <div className="mt-4 flex justify-between">
// //             <button
// //               className="bg-blue-500 text-white px-4 py-1 rounded"
// //               onClick={() => alert('Start video call logic here')}
// //             >
// //               Video Call
// //             </button>
// //             <button
// //               className="bg-green-600 text-white px-4 py-1 rounded"
// //               onClick={() => setSelectedCase(item)}
// //             >
// //               Prescription
// //             </button>
// //           </div>
// //         </div>
// //       ))}

// //       {/* Prescription Modal */}
// //       {selectedCase && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md">
// //             <h3 className="text-xl font-bold mb-2">
// //               Prescription for {selectedCase.petName}
// //             </h3>
// //             <textarea
// //               className="w-full border rounded p-2 mb-4"
// //               rows="5"
// //               value={prescriptionText}
// //               onChange={(e) => setPrescriptionText(e.target.value)}
// //               placeholder="Write prescription here..."
// //             />
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="bg-gray-400 text-white px-3 py-1 rounded"
// //                 onClick={() => setSelectedCase(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="bg-green-600 text-white px-3 py-1 rounded"
// //                 onClick={handlePrescriptionSubmit}
// //               >
// //                 Submit
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DoctorProfile;


// // import React, { useContext, useEffect, useState } from 'react';
// // import { AuthContext } from '../../Providers/AuthProviders';

// // const DoctorProfile = () => {
// //   const { user } = useContext(AuthContext);
// //   const [queue, setQueue] = useState([]);
// //   const [selectedCase, setSelectedCase] = useState(null);
// //   const [selectedLink, setSelectedLink] = useState(null);

// //   const [prescriptionText, setPrescriptionText] = useState('');
// //   const [videoLink, setVideoLink] = useState('');
// // const [videoCase, setVideoCase] = useState(null);

  

// //   useEffect(() => {
// //     fetch('https://pawkie-server.vercel.app/api/queue')
// //       .then(res => res.json())
// //       .then(data => {
// //         const filtered = data.filter(item => item.doctorEmail === user?.email);
// //         setQueue(filtered);
// //       });
// //   }, [user?.email]);

// //   const handlePrescriptionSubmit = async () => {
// //     if (!selectedCase || !prescriptionText) return;

// //     const prescriptionData = {
// //       userId: selectedCase.userId,
// //       doctorEmail: user.email,
// //       petName: selectedCase.petName,
// //       prescription: prescriptionText,
// //       createdAt: new Date()
// //     };

// //     try {
// //       // Send prescription
// //       await fetch('https://pawkie-server.vercel.app/api/prescriptions', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(prescriptionData)
// //       });

// //       // Delete from queue
// //       await fetch(`https://pawkie-server.vercel.app/api/queue/${selectedCase._id}`, {
// //         method: 'DELETE'
// //       });

// //       // Update UI
// //       setQueue(prev => prev.filter(item => item._id !== selectedCase._id));
// //       setSelectedCase(null);
// //       setPrescriptionText('');
// //     } catch (err) {
// //       console.error('Error handling prescription:', err);
// //     }
// //   };

// //   return (
// //     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
// //       <h2>sdfsdfsdf</h2>
// //       {queue.map((item) => (
// //         <div key={item._id} className="bg-white p-4 rounded-xl shadow-md border">
// //           <h2 className="text-xl font-bold mb-2">{item.petName}</h2>
// //           <p><strong>Age:</strong> {item.petAge}</p>
// //           <p><strong>Problem:</strong> {item.problem}</p>
// //           <p><strong>Status:</strong> {item.status}</p>
// //           <div className="mt-4 justify-between grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <button
// //               className="bg-blue-500 text-white px-4 py-1 rounded"
// //               onClick={() => alert('Start video call logic here')}
// //             >
// //               Video Call
// //             </button>
// //             <button
// //               className="bg-blue-500 text-white px-4 py-1 rounded"
// //               onClick={() => alert('Start video call logic here')}
// //             >
// //               Post A Link
// //             </button>
            
// //             <button
// //               className="bg-green-600 text-white px-4 py-1 rounded"
// //               onClick={() => setSelectedCase(item)}
// //             >
// //               Prescription
// //             </button>

// //           </div>
// //         </div>
// //       ))}

// //       {/* Prescription Modal */}
// //       {selectedCase && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md">
// //             <h3 className="text-xl font-bold mb-2">
// //               Prescription for {selectedCase.petName}
// //             </h3>
// //             <textarea
// //               className="w-full border rounded p-2 mb-4"
// //               rows="5"
// //               value={prescriptionText}
// //               onChange={(e) => setPrescriptionText(e.target.value)}
// //               placeholder="Write prescription here..."
// //             />
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="bg-gray-400 text-white px-3 py-1 rounded"
// //                 onClick={() => setSelectedCase(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="bg-green-600 text-white px-3 py-1 rounded"
// //                 onClick={handlePrescriptionSubmit}
// //               >
// //                 Submit
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       {/* Prescription Modal */}
// //       {selectedLink && (
// //         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md">
// //             <h3 className="text-xl font-bold mb-2">
// //               Link
// //             </h3>
// //             <textarea
// //               className="w-full border rounded p-2 mb-4"
// //               rows="5"
// //               value={prescriptionText}
// //               onChange={(e) => setPrescriptionText(e.target.value)}
// //               placeholder="Write prescription here..."
// //             />
// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="bg-gray-400 text-white px-3 py-1 rounded"
// //                 onClick={() => setSelectedCase(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="bg-green-600 text-white px-3 py-1 rounded"
// //                 onClick={handleLink}
// //               >
// //                 Submit
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DoctorProfile;

// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../../Providers/AuthProviders';

// const DoctorProfile = () => {
//   const { user } = useContext(AuthContext);
//   const [queue, setQueue] = useState([]);
//   const [selectedCase, setSelectedCase] = useState(null);
//   const [selectedLinkCase, setSelectedLinkCase] = useState(null);
//   const [prescriptionText, setPrescriptionText] = useState('');
//   const [videoLink, setVideoLink] = useState('');

//   useEffect(() => {
//     fetch('https://pawkie-server.vercel.app/api/queue')
//       .then(res => res.json())
//       .then(data => {
//         const filtered = data.filter(item => item.doctorEmail === user?.email);
//         setQueue(filtered);
//       });
//   }, [user?.email]);

//   const handlePrescriptionSubmit = async () => {
//     if (!selectedCase || !prescriptionText) return;

//     const prescriptionData = {
//       userId: selectedCase.userId,
//       doctorEmail: user.email,
//       petName: selectedCase.petName,
//       prescription: prescriptionText,
//       createdAt: new Date()
//     };

//     try {
//       // Send prescription
//       await fetch('https://pawkie-server.vercel.app/api/prescriptions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(prescriptionData)
//       });

//       // Delete from queue
//       await fetch(`https://pawkie-server.vercel.app/api/queue/${selectedCase._id}`, {
//         method: 'DELETE'
//       });

//       // Update UI
//       setQueue(prev => prev.filter(item => item._id !== selectedCase._id));
//       setSelectedCase(null);
//       setPrescriptionText('');
//     } catch (err) {
//       console.error('Error handling prescription:', err);
//     }
//   };

//   const handleLinkSubmit = async () => {
//     if (!selectedLinkCase || !videoLink) return;

//     try {
//       // Send notification or update the case with the video link
//       await fetch('https://pawkie-server.vercel.app/api/notifications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: selectedLinkCase.userId,
//           message: `Video consultation link for ${selectedLinkCase.petName}: ${videoLink}`,
//           type: 'video-link'
//         })
//       });

//       // Close modal and reset
//       setSelectedLinkCase(null);
//       setVideoLink('');
//       alert('Link sent successfully!');
//     } catch (err) {
//       console.error('Error sending link:', err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Your Consultation Queue</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {queue.map((item) => (
//           <div key={item._id} className="bg-white p-4 rounded-xl shadow-md border">
//             <h2 className="text-xl font-bold mb-2">{item.petName}</h2>
//             <p><strong>Age:</strong> {item.petAge}</p>
//             <p><strong>Problem:</strong> {item.problem}</p>
//             <p><strong>Status:</strong> {item.status}</p>
            
//             <div className="mt-4 flex flex-wrap gap-2">
//               {/* <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex-1 min-w-[120px]"
//                 onClick={() => alert('Start video call logic here')}
//               >
//                 Video Call
//               </button> */}
              
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex-1 min-w-[120px]"
//                 onClick={() => setSelectedLinkCase(item)}
//               >
//                 Post A Link
//               </button>
              
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded flex-1 min-w-[120px]"
//                 onClick={() => setSelectedCase(item)}
//               >
//                 Prescription
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Prescription Modal */}
//       {selectedCase && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
//             <h3 className="text-xl font-bold mb-2">
//               Prescription for {selectedCase.petName}
//             </h3>
//             <textarea
//               className="w-full border rounded p-2 mb-4"
//               rows="5"
//               value={prescriptionText}
//               onChange={(e) => setPrescriptionText(e.target.value)}
//               placeholder="Write prescription here..."
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
//                 onClick={() => setSelectedCase(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
//                 onClick={handlePrescriptionSubmit}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Link Submission Modal */}
//       {selectedLinkCase && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
//             <h3 className="text-xl font-bold mb-2">
//               Video Consultation Link for {selectedLinkCase.petName}
//             </h3>
//             <input
//               type="text"
//               className="w-full border rounded p-2 mb-4"
//               value={videoLink}
//               onChange={(e) => setVideoLink(e.target.value)}
//               placeholder="Enter video consultation link..."
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
//                 onClick={() => setSelectedLinkCase(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
//                 onClick={handleLinkSubmit}
//               >
//                 Send Link
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorProfile;




import React, { useState } from 'react';
import axios from 'axios';

const DoctorProfile = ({ doctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...doctor });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://pawkie-server.vercel.app/doctors/${doctor.email}`, formData);
      alert('Doctor info updated successfully!');
      setIsEditing(false);
      // Optionally refresh or pass updated data back to parent component
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update info.');
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="bg-gray-100 p-4 rounded mt-4">
        <h2 className="text-lg font-semibold mb-2">Edit Doctor Info</h2>

        <div className="mb-2">
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Institution:</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Graduation Year:</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Experience:</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-semibold mb-2">Doctor Profile</h2>
      <img src={doctor.image} alt="Doctor" className="w-32 h-32 object-cover rounded-full mb-4" />
      <p><strong>Name:</strong> {doctor.name}</p>
      <p><strong>Institution:</strong> {doctor.institution}</p>
      <p><strong>Graduation Year:</strong> {doctor.graduationYear}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
      <p><strong>Email:</strong> {doctor.email}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
    </div>
  );
};

export default DoctorProfile;
