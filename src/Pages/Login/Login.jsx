import React, { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import Swal from 'sweetalert2';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        signIn(email, password)
            .then((result) => {
                Swal.fire({
                    title: 'Login Successful!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                });
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] px-4 -mt-5" >
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 md:flex md:items-center md:justify-between">

            <div className="hidden md:flex md:flex-col md:items-center md:justify-center w-1/2 text-center">
            <img 
            src="src/assets/icon.png" 
            alt="Logo" 
            className="h-12 md:h-40 mb-4"
            />
            <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
            <p className="mt-4 text-white/80">
            Login to your account and continue exploring <br /> our services.
            </p>
            </div>
            
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-white font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full mt-1 px-4 py-2 border border-white/20 bg-white/10 text-white rounded-lg placeholder-white/60 focus:ring-2 focus:ring-[#F7B385] focus:outline-none"
                                placeholder="Enter your password"
                                required
                            />
                            <div className="text-right mt-2">
                                <a href="#" className="text-sm text-[#F7B385] hover:underline">Forgot password?</a>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-[#FFD6BE] text-[#5F040D] font-bold rounded-lg hover:bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] hover:text-[#FFFFFF] transition-all">
                            Login
                        </button>
                    </form>
                    <SocialLogin />
                    <p className="mt-4 text-center text-white/80">
                        New Here? <Link to="/register" className="text-[#F7B385] hover:underline">Create an Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
