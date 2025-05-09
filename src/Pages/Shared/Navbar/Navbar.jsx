import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Providers/AuthProviders';
import logo from "../../../assets/logo_2.png"
import useAdmin from '../../../Hooks/useAdmin';
import useDoctor from '../../../Hooks/useDoctor';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isAdmin] = useAdmin();
    const [isDoctor] = useDoctor();

    const handlelogout = () => {
        logout()
            .then(() => { })
            .catch(error => console.log(error));
    };

    const navOptions = <>
        <li><Link to='/' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Home</Link></li>
        <li><Link to='/Adoption' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Adoption</Link></li>
        <li><Link to='/rescue' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Rescue</Link></li>
        <li><Link to='/missingfeed' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Missing Pets</Link></li>
        <li><Link to='/Shop' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Shop</Link></li>
        <li><Link to='/medical' className="relative text-[#F5E3D9] font-semibold hover:text-white transition-colors duration-200 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full">Medical Assistance</Link></li>
    </>;

    return (
        <div className="navbar max-w-[105rem] mx-auto z-50 px-4 relative">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F7B385]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-[#49312C] rounded-box z-10 mt-3 w-52 p-2 shadow text-[#F7B385]">
                        {navOptions}
                    </ul>
                </div>
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-18 w-auto object-contain" />
                </div>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-2">
                    {navOptions}
                </ul>
            </div>

            <div className='navbar-end space-x-2 items-center'>
                {user && (
                    <div className="relative group">
                        <div
                            className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#F7B385] to-[#CD346C] text-white shadow-lg hover:scale-105 transition-transform duration-300"
                            title="Dashboard"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#CD346C] flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5.121 17.804A9 9 0 1112 21a8.96 8.96 0 01-6.879-3.196z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.displayName || "User"}</span>
                                <span className="text-xs font-light">Dashboard</span>
                            </div>
                        </div>

                        {/* Dropdown menu */}
                        <div
                            className="absolute right-0 mt-2 w-44 rounded-xl shadow-xl backdrop-blur-md bg-[#49312cb0] border border-white/10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20"
                        >
                            <ul className="text-[#F5E3D9] py-2">
                                <li>
                                    <Link
                                        to={
                                            isAdmin
                                                ? '/dashboard/adminDashboard'
                                                : isDoctor
                                                    ? '/dashboard/doctorProfile'
                                                    : '/dashboard/user'
                                        }
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-[#CD346C] hover:text-white transition-colors duration-200"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handlelogout}
                                        className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-[#CD346C] hover:text-white transition-colors duration-200"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {!user && (
                    <>
                        <Link
                            to="/login"
                            className="btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="btn bg-[#CD346C] text-[#F5E3D9] border-0 hover:bg-[#F6C7CF] hover:text-[#CD346C] transition"
                        >
                            SignUp
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
