import React, { useContext } from 'react';
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProviders';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import registeration from '../../../src/assets/icon.png'


const Registration = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append('image', imageFile);
    
        try {
            const res = await fetch(image_hosting_api, {
                method: 'POST',
                body: formData,
            });
    
            const imgResponse = await res.json();
    
            if (imgResponse.success) {
                const imageUrl = imgResponse.data.display_url;
    
                createUser(data.email, data.password)
                    .then(() => {
                        updateUserProfile(data.name, imageUrl)
                            .then(() => {
                                const userInfo = {
                                    name: data.name,
                                    email: data.email,
                                    phone: data.phone,
                                    image: imageUrl,
                                };
    
                                fetch('https://pawkie-server.vercel.app/users', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(userInfo),
                                })
                                    .then((res) => res.json())
                                    .then(() => {
                                        Swal.fire({
                                            position: "top-end",
                                            icon: "success",
                                            title: "Successfully Signed Up!",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                        navigate('/');
                                    });
                            })
                            .catch((error) => console.log(error));
                    });
            }
        } catch (error) {
            console.error("Image upload failed", error);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] px-4">
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 md:flex md:items-center md:justify-between">
                <div className="hidden md:flex md:flex-col md:items-center md:justify-center w-1/2 text-center">
                    <img 
                        src={registeration}
                        alt="Logo" 
                        className="h-12 md:h-40 mb-4"
                    />
                    <h1 className="text-4xl font-bold text-white">Join Us Today!</h1>
                    <p className="mt-4 text-white/80">Create an account to explore our platform.</p>
                </div>
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-white font-medium">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium">Phone</label>
                            <input
                                type="text"
                                {...register("phone", { required: true })}
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium">Profile Image URL</label>
                            <input
                                type="file"
                                {...register("image", { required: true })}
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter image URL (imgbb preferred)"
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium">Password</label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: true,
                                    minLength: 6,
                                    maxLength: 20,
                                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                                })}
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter a strong password"
                            />
                            {errors.password && (
                                <p className='text-red-400 text-sm mt-1'>
                                    Password must be 6-20 characters, include a capital letter, a number, and a special character.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-[#FFD6BE] text-[#5F040D] font-bold rounded-lg hover:bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] hover:text-white transition-all">
                            Sign Up
                        </button>
                    </form>
                    <SocialLogin />
                    <p className="mt-4 text-center text-white/80">
                        Already have an account? <Link to="/login" className="text-[#F7B385] hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;