import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';
import Swal from 'sweetalert2';

const UserRescuePost = () => {
    const { user } = useContext(AuthContext);
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
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

        try {
            const formData = new FormData();
            formData.append("image", petData.image);

            const imgbbResponse = await axios.post(image_hosting_api, formData);
            const imageUrl = imgbbResponse.data.data.url;

            const response = await axios.post("https://pawkie-server.vercel.app/api/rescue-pet", {
                details: petData.details,
                image: imageUrl,
                userEmail: user.email,
                userName: user.displayName,
                userImage: user.photoURL
            });

            setPosts((prevPosts) => [response.data.post, ...prevPosts]);
            setPetData({ details: "", image: null });
            setImagePreview(null);
            setIsSubmitting(false);

            Swal.fire({
                icon: 'success',
                title: 'Post Submitted!',
                text: 'Your missing pet report has been posted.'
            });
        } catch (error) {
            console.error("Error submitting post:", error);
            setIsSubmitting(false);

            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'An error occurred while submitting your post. Please try again.'
            });
        }
    };

    useEffect(() => {
        axios.get("https://pawkie-server.vercel.app/api/rescue-posts")
            .then((res) => setPosts(res.data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    return (
        <div>
            <div className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-[#FFD6BE] via-[#FFE8DA] to-[#FFD6BE] py-30 px-6 lg:px-20 items-center justify-between text-center">
                    <h1 className="text-5xl font-bold text-[#840B36] mb-6">Never Leave Your Pet Behind</h1>
                    <p className="text-xl text-[#BA6C7D] mb-8">
                        Join our community to help locate missing pets and reunite them with their families.
                    </p>

                    <div className="post-creator bg-white shadow-lg rounded-lg mx-auto max-w-xl">
                        <div className="post-header px- py-4">
                            <h3 className="text-[#840B36] text-lg font-semibold">Create Missing Pet Report</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="post-content px-6 py-3">
                                <textarea
                                    name="details"
                                    placeholder="Mention Location and contact Information"
                                    value={petData.details}
                                    onChange={handleInputChange}
                                    className="w-full p-4 border border-gray-300 rounded-md text-[#840B36]"
                                    rows="4"
                                    required
                                />
                                {imagePreview && (
                                    <div className="image-preview my-4 relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-full max-h-60 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setPetData(prev => ({ ...prev, image: null }));
                                            }}
                                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="post-footer px-6 py-4 flex justify-between items-center">
                                <label htmlFor="imageInput" className="cursor-pointer flex items-center space-x-2 text-[#840B36] hover:text-[#BA6C7D]">
                                    <i className="fas fa-camera"></i>
                                    <span>Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="imageInput"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="bg-[#BA6C7D] text-white px-4 py-2 rounded hover:bg-[#840B36] transition"
                                    disabled={isSubmitting || !petData.details || !petData.image}
                                >
                                    {isSubmitting ? "Submitting..." : "Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                {/* <RescueFeed posts={posts} /> */}
            </div>
        </div>
    );
};

export default UserRescuePost;
