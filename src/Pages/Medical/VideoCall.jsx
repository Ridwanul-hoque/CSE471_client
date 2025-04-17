// 3. Video Call Page (Mock UI)
import React from "react";

export const VideoCall = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h2 className="text-3xl font-bold text-[#49312C] mb-6">Live Video Consultation</h2>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-xl shadow-lg relative">
        <p className="text-white text-center pt-32">[Doctor Video Feed Placeholder]</p>
      </div>
      <div className="flex gap-4 mt-6">
        <button className="bg-green-500 px-6 py-2 rounded-lg text-white font-semibold">Mic On</button>
        <button className="bg-blue-500 px-6 py-2 rounded-lg text-white font-semibold">Camera On</button>
        <button className="bg-red-500 px-6 py-2 rounded-lg text-white font-semibold">End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;