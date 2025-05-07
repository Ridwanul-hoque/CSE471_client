import React, { useState, useEffect } from "react";
import axios from "axios";
import RescueFeed from "../Rescue/RescueFeed";
import SparkleEffect from "../Shared/SparklelEffect/SparkleEffect";
import { Link } from "react-router-dom";
import ChatBotButton from '../Component/ChatBot/ChatBotButton';
import ChatWindow from '../Component/ChatBot/ChatWindow';
import Swal from "sweetalert2";

const Rescue = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const [petData, setPetData] = useState({ details: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPetData({ ...petData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("details", petData.details);
    formData.append("image", petData.image);

    try {
      const response = await axios.post("https://pawkie-server.vercel.app/api/rescue-pet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts((prevPosts) => [response.data.post, ...prevPosts]);

      setPetData({ details: "", image: null });
      setImagePreview(null);
      setIsSubmitting(false);

      Swal.fire({
        icon: "success",
        title: "Post submitted!",
        text: "Your rescue report has been posted successfully.",
        confirmButtonColor: "#BA6C7D"
      });
    } catch (error) {
      console.error("Error submitting post:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get("https://pawkie-server.vercel.app/api/rescue-posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <div className="relative bg-gradient-to-r from-[#FFE8DA] via-[#FFF0EA] to-[#FFE8DA] py-16 px-6 lg:px-20 text-center overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="animate-pulse absolute top-4 left-10 text-[#F4B7A8] text-4xl">🐾</div>
          <div className="animate-pulse absolute top-12 right-12 text-[#F4B7A8] text-3xl">🐾</div>
          <div className="animate-pulse absolute bottom-10 left-20 text-[#F4B7A8] text-2xl">🐾</div>
        </div>

        <h2 className="relative z-10 text-5xl font-extrabold text-[#840B36] mb-4 drop-shadow-lg">
          🐾 Recently Posted Rescue Pets
        </h2>
        <p className="relative z-10 text-xl text-[#BA6C7D] max-w-3xl mx-auto leading-relaxed">
          Every paw print tells a story. Browse our latest rescue reports and help spread the word to reunite families with their beloved pets.
        </p>
        <Link
          to={'/dashboard/userRescue'}
          className="mt-6 inline-flex items-center space-x-2 bg-[#BA6C7D] hover:bg-[#840B36] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
        >
          <span className="text-lg">🐶 Post for Rescue</span>
        </Link>
      </div>

      <div className="mt-10">
        <RescueFeed posts={posts} />
      </div>

      <ChatBotButton toggleChat={toggleChat} />
      {isChatOpen && <ChatWindow closeChat={toggleChat} />}
    </div>
  );
};

export default Rescue;
