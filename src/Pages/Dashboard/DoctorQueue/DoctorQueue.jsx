import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';

const DoctorQueue = () => {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    fetch('https://pawkie-server.vercel.app/api/queue')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item => item.doctorEmail === user?.email);
        setQueue(filtered);
      });
  }, [user?.email]);

  const handlePrescriptionSubmit = async () => {
    if (!selectedCase || !prescriptionText) return;

    const prescriptionData = {
      userId: selectedCase.userId,
      doctorEmail: user.email,
      petName: selectedCase.petName,
      prescription: prescriptionText,
      createdAt: new Date()
    };

    try {
      await fetch('https://pawkie-server.vercel.app/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });

      await fetch(`https://pawkie-server.vercel.app/api/queue/${selectedCase._id}`, {
        method: 'DELETE'
      });

      setQueue(prev => prev.filter(item => item._id !== selectedCase._id));
      setSelectedCase(null);
      setPrescriptionText('');
    } catch (err) {
      console.error('Error handling prescription:', err);
    }
  };

  const handleLinkSubmit = async () => {
    if (!selectedLink || !linkText) return;

    const linkData = {
      userId: selectedLink.userId,
      doctorEmail: user.email,
      link: linkText,
      IPO: false,
      createdAt: new Date()
    };

    try {
      await fetch('https://pawkie-server.vercel.app/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
      });

      setSelectedLink(null);
      setLinkText('');
    } catch (err) {
      console.error('Error posting link:', err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#FFE8DA]">
      <h1 className="text-3xl font-bold text-[#5F040D] mb-6 text-center">Doctor's Patient Queue</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queue.map((item) => (
          <div key={item._id} className="bg-[#FFD6BE] border border-[#9C3346] p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-[#5F040D] mb-2">{item.petName}</h2>
            <p className="text-[#5F040D]"><strong>Age:</strong> {item.petAge}</p>
            <p className="text-[#5F040D]"><strong>Problem:</strong> {item.problem}</p>
            <p className="text-[#5F040D]"><strong>Status:</strong> {item.status}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="bg-[#9C3346] hover:bg-[#5F040D] transition-colors text-white px-4 py-2 rounded-xl"
                onClick={() => window.open('http://localhost:3000/', '_blank')}
              >
                Video Call
              </button>
              <button
                className="bg-[#9C3346] hover:bg-[#5F040D] transition-colors text-white px-4 py-2 rounded-xl"
                onClick={() => setSelectedLink(item)}
              >
                Post a Link
              </button>
              <button
                className="bg-[#5F040D] hover:bg-[#9C3346] transition-colors text-white px-4 py-2 rounded-xl"
                onClick={() => setSelectedCase(item)}
              >
                Prescription
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#5F040D] mb-4">
              Prescription for {selectedCase.petName}
            </h3>
            <textarea
              className="w-full border border-gray-300 rounded p-3 mb-4"
              rows="5"
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="Write prescription here..."
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setSelectedCase(null)}
              >
                Cancel
              </button>
              <button
                className="bg-[#5F040D] hover:bg-[#9C3346] text-white px-4 py-2 rounded"
                onClick={handlePrescriptionSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Link Modal */}
      {selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#5F040D] mb-4">
              Post a Link for {selectedLink.petName}
            </h3>
            <textarea
              className="w-full border border-gray-300 rounded p-3 mb-4"
              rows="3"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Paste link here..."
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setSelectedLink(null)}
              >
                Cancel
              </button>
              <button
                className="bg-[#9C3346] hover:bg-[#5F040D] text-white px-4 py-2 rounded"
                onClick={handleLinkSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
