import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';

const VideoCall = () => {
  const { user } = useContext(AuthContext);
  const [queueStatus, setQueueStatus] = useState(null);
  const [meetingLink, setMeetingLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animated animals data
  const animatedAnimals = [
    { emoji: '🐶', name: 'Happy Dog', x: 10, y: 20 },
    { emoji: '🐱', name: 'Curious Cat', x: 80, y: 15 },
    { emoji: '🐰', name: 'Jumping Rabbit', x: 20, y: 70 },
    { emoji: '🐦', name: 'Flying Bird', x: 70, y: 60 },
    { emoji: '🦋', name: 'Dancing Butterfly', x: 45, y: 30 },
    { emoji: '🐠', name: 'Swimming Fish', x: 15, y: 45 },
  ];

  // Poll for queue status and meeting links
  useEffect(() => {
    if (!user?.email) return;

    const checkStatus = async () => {
      try {
        // First, get current user data to get userId
        const userResponse = await fetch(`https://pawkie-server.vercel.app/users/${user.email}`);
        const userData = await userResponse.json();

        if (!userData._id) {
          setError('User data not found');
          return;
        }

        // Get queue status (assuming we need to pass doctorEmail - you might need to adjust this)
        // For now, we'll get all queue items for this user and find the latest one
        const queueResponse = await fetch('https://pawkie-server.vercel.app/api/queue');
        const queueData = await queueResponse.json();
        
        const userQueueItem = queueData.find(item => item.userId === userData._id);
        
        if (userQueueItem) {
          setQueueStatus(userQueueItem);

          // If accepted, check for meeting link
          if (userQueueItem.status === 'accepted') {
            const linksResponse = await fetch(`https://pawkie-server.vercel.app/api/links?userId=${userData._id}&doctorEmail=${userQueueItem.doctorEmail}`);
            const linksData = await linksResponse.json();
            
            if (linksData.length > 0) {
              // Get the most recent link
              const latestLink = linksData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
              setMeetingLink(latestLink.link);
            }
          }
        }
      } catch (err) {
        console.error('Error checking status:', err);
        setError('Failed to check status');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user?.email]);

  const handleJoinCall = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  const getStatusMessage = () => {
    if (loading) return "Loading...";
    if (error) return error;
    if (!queueStatus) return "You are not in any queue currently.";
    
    switch (queueStatus.status) {
      case 'waiting':
        return "Please wait... Doctor will accept your request soon";
      case 'accepted':
        return meetingLink 
          ? "You are accepted to join! Please click here to join the call" 
          : "You are accepted! Waiting for meeting link...";
      case 'removed':
        return "You are removed from the call list due to violation of user policy.";
      default:
        return "Unknown status";
    }
  };

  const getStatusColor = () => {
    if (loading || error || !queueStatus) return "text-yellow-600";
    
    switch (queueStatus.status) {
      case 'waiting':
        return "text-yellow-600";
      case 'accepted':
        return "text-green-600";
      case 'removed':
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8DA] via-[#FFD6BE] to-[#F7B385] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Animated Animals Background */}
      {animatedAnimals.map((animal, index) => (
        <div
          key={index}
          className="absolute text-4xl animate-bounce"
          style={{
            left: `${animal.x}%`,
            top: `${animal.y}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${2 + (index % 3)}s`
          }}
        >
          {animal.emoji}
        </div>
      ))}

      {/* Floating Animation - Using inline styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#5F040D] mb-4">
            🏥 Virtual Vet Consultation
          </h1>
          <div className="float-animation inline-block">
            <div className="text-6xl mb-4">
              {queueStatus?.status === 'accepted' && meetingLink ? '✅' : 
               queueStatus?.status === 'removed' ? '❌' : '⏳'}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-8">
          <p className={`text-xl font-semibold mb-4 ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>
          
          {queueStatus && queueStatus.status !== 'removed' && (
            <div className="bg-[#FFE8DA] rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-[#5F040D] mb-2">Pet Information:</h3>
              <p className="text-[#5F040D]"><strong>Pet Name:</strong> {queueStatus.petName}</p>
              <p className="text-[#5F040D]"><strong>Age:</strong> {queueStatus.petAge}</p>
              <p className="text-[#5F040D]"><strong>Problem:</strong> {queueStatus.problem}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {queueStatus?.status === 'accepted' && meetingLink && (
          <button
            onClick={handleJoinCall}
            className="bg-[#5F040D] hover:bg-[#9C3346] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎥 Join Video Call
          </button>
        )}

        {/* Loading Animation */}
        {queueStatus?.status === 'waiting' && (
          <div className="mt-6">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-[#5F040D] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#5F040D] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-[#5F040D] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-[#5F040D] mt-2 text-sm">Doctor is reviewing your request...</p>
          </div>
        )}
      </div>

      {/* Patient Policy Section */}
      <div className="relative z-10 mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-[#5F040D] mb-4 text-center">
          📋 Patient Policy
        </h2>
        <div className="text-[#5F040D] space-y-2 text-sm">
          <p>• <strong>Be respectful:</strong> Treat the doctor with courtesy and professionalism</p>
          <p>• <strong>Be punctual:</strong> Join the call promptly when accepted</p>
          <p>• <strong>Be prepared:</strong> Have your pet ready and relevant information available</p>
          <p>• <strong>Follow instructions:</strong> Listen carefully to the doctor's guidance</p>
          <p>• <strong>No recording:</strong> Do not record the video consultation without permission</p>
          <p className="text-red-600 font-semibold mt-4">
            ⚠️ Violation of these policies may result in removal from the consultation queue
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 left-4 text-2xl animate-pulse">🩺</div>
      <div className="absolute bottom-4 right-4 text-2xl animate-pulse">❤️</div>
      <div className="absolute top-4 left-4 text-2xl animate-spin" style={{animationDuration: '4s'}}>🌟</div>
      <div className="absolute top-4 right-4 text-2xl animate-spin" style={{animationDuration: '6s'}}>⭐</div>
    </div>
  );
};

export default VideoCall;