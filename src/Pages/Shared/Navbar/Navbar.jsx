import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Providers/AuthProviders';
import logo from "../../../assets/logo.png"

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)

    const handlelogout = () => {
        logout()
            .then(() => { })
            .catch(error => console.log(error))
    }

    const navOptions = <>
        <li><Link to={'/'} className="text-[#F7B385] font-semibold hover:text-white transition-colors duration-200">Home</Link></li>
        <li><Link to={'/adoption'} className="text-[#F7B385] font-semibold hover:text-white transition-colors duration-200">Adoption</Link></li>
        <li><Link to={'/accessories'} className="text-[#F7B385] font-semibold hover:text-white transition-colors duration-200">Accessories</Link></li>
        <li><Link to={'/medical'} className="text-[#F7B385] font-semibold hover:text-white transition-colors duration-200">Medical Assistance</Link></li>
        <li><Link to={'/dashboard'} className="text-[#F7B385] font-semibold hover:text-white transition-colors duration-200">Dashboard</Link></li>
    </>

    return (
        <div className="navbar max-w-screen-xl mx-auto ">
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
                    <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-18 w-auto object-contain" />
                    <span className="text-2xl font-bold text-[#F7B385] tracking-wide">Pawkie</span>
                    </Link>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-2">
                    {navOptions}
                </ul>
            </div>
            <div className='navbar-end space-x-2'>
                {user ? (
                    <button onClick={handlelogout} className='btn bg-[#F7B385] text-[#49312C] border-0 hover:brightness-110 transition'>Logout</button>
                ) : (
                    <>
                        <Link to="/login" className='btn bg-[#F7B385] text-[#49312C] border-0 hover:brightness-110 transition'>Login</Link>
                        <Link to="/register" className='btn bg-[#F7B385] text-[#49312C] border-0 hover:brightness-110 transition'>SignUp</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
