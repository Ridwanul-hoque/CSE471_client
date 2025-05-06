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
    fetch('http://localhost:5000/api/queue')
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
      await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });

      await fetch(`http://localhost:5000/api/queue/${selectedCase._id}`, {
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
      createdAt: new Date()
    };

    try {
      await fetch('http://localhost:5000/api/links', {
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
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {queue.map((item) => (
        <div key={item._id} className="bg-white p-4 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold mb-2">{item.petName}</h2>
          <p><strong>Age:</strong> {item.petAge}</p>
          <p><strong>Problem:</strong> {item.problem}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => alert('Start video call logic here')}
            >
              Video Call
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => setSelectedLink(item)}
            >
              Post A Link
            </button>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() => setSelectedCase(item)}
            >
              Prescription
            </button>
          </div>
        </div>
      ))}

      {/* Prescription Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">
              Prescription for {selectedCase.petName}
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="5"
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="Write prescription here..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setSelectedCase(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">
              Post a Link for {selectedLink.petName}
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="3"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Paste link here..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setSelectedLink(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
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
