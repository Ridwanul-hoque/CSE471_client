import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';

const DoctorQueue = () => {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedLinkCase, setSelectedLinkCase] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [linkText, setLinkText] = useState('');
  
  // New states for conference call link
  const [conferenceLinkText, setConferenceLinkText] = useState('');
  const [showConferenceModal, setShowConferenceModal] = useState(false);

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
    if (!selectedLinkCase || !linkText) return;

    const linkData = {
      userId: selectedLinkCase.userId,
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

      setSelectedLinkCase(null);
      setLinkText('');
      alert('Link sent successfully to patient!');
    } catch (err) {
      console.error('Error posting link:', err);
    }
  };

  // FIXED FUNCTIONS - No server calls for Accept, only local updates
  const handleAcceptPatient = (patientId) => {
    // Only update local state - no server call
    setQueue(prev => prev.map(item => 
      item._id === patientId 
        ? { ...item, status: 'accepted' }
        : item
    ));
    
    alert('Patient accepted! You can now share the conference link with them.');
  };

  const handleRemovePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to remove this patient from the queue?')) {
      try {
        // Use existing DELETE endpoint - this works
        const response = await fetch(`https://pawkie-server.vercel.app/api/queue/${patientId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          setQueue(prev => prev.filter(item => item._id !== patientId));
          alert('Patient removed from queue due to policy violation');
        } else {
          throw new Error('Failed to remove patient');
        }
      } catch (error) {
        console.error('Error removing patient:', error);
        alert('Failed to remove patient from server');
      }
    }
  };

  // Conference link submission - works with existing API
  const handleConferenceLinkSubmit = async () => {
    if (!conferenceLinkText.trim()) {
      alert('Please enter a valid Google Meet link');
      return;
    }

    try {
      // Store the conference link for all current patients in queue
      const linkPromises = queue.map(patient => 
        fetch('https://pawkie-server.vercel.app/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: patient.userId,
            doctorEmail: user.email,
            link: conferenceLinkText,
            IPO: false,
            createdAt: new Date()
          })
        })
      );

      await Promise.all(linkPromises);
      
      setConferenceLinkText('');
      setShowConferenceModal(false);
      alert(`Conference link shared with all ${queue.length} patients in queue!`);
    } catch (err) {
      console.error('Error posting conference link:', err);
      alert('Failed to share conference link. Please try again.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#FFE8DA]">
      <h1 className="text-3xl font-bold text-[#5F040D] mb-6 text-center">Doctor's Patient Queue</h1>
      
      {/* Conference Call Link Section */}
      <div className="mb-8 bg-[#FFD6BE] border border-[#9C3346] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-[#5F040D] mb-4">Conference Call Link</h2>
        <p className="text-[#5F040D] mb-4">Create a Google Meet call and paste the link here to share with all patients in your queue.</p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="url"
            value={conferenceLinkText}
            onChange={(e) => setConferenceLinkText(e.target.value)}
            placeholder="Paste Google Meet link here..."
            className="flex-1 px-4 py-3 border border-[#9C3346] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F040D]"
          />
          <button
            onClick={handleConferenceLinkSubmit}
            disabled={!conferenceLinkText.trim()}
            className="bg-[#5F040D] hover:bg-[#9C3346] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-white px-6 py-3 rounded-xl font-semibold"
          >
            Submit Link
          </button>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queue.map((item) => (
          <div key={item._id} className="bg-[#FFD6BE] border border-[#9C3346] p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-[#5F040D] mb-2">{item.petName}</h2>
            <p className="text-[#5F040D]"><strong>Age:</strong> {item.petAge}</p>
            <p className="text-[#5F040D]"><strong>Problem:</strong> {item.problem}</p>
            <p className="text-[#5F040D]">
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                item.status === 'accepted' ? 'bg-green-200 text-green-800' :
                item.status === 'removed' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {item.status}
              </span>
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {item.status === 'waiting' && (
                <>
                  <button
                    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-xl"
                    onClick={() => handleAcceptPatient(item._id)}
                  >
                    Accept Patient
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-xl"
                    onClick={() => handleRemovePatient(item._id)}
                  >
                    Remove from Queue
                  </button>
                </>
              )}
              
              <button
                className="bg-[#9C3346] hover:bg-[#5F040D] transition-colors text-white px-4 py-2 rounded-xl"
                onClick={() => window.open('http://localhost:3000/', '_blank')}
              >
                Video Call
              </button>
              <button
                className="bg-[#9C3346] hover:bg-[#5F040D] transition-colors text-white px-4 py-2 rounded-xl"
                onClick={() => setSelectedLinkCase(item)}
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

      {/* Individual Patient Link Modal */}
      {selectedLinkCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#5F040D] mb-4">
              Post a Link for {selectedLinkCase.petName}
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
                onClick={() => setSelectedLinkCase(null)}
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