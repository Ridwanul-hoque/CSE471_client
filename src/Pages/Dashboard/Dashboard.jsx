import React from 'react';

const Dashboard = () => {
    return (
        <div className='flex'>
            {/* Sidebar */}
            <div className='w-64 min-h-screen bg-gradient-to-r from-[#5F040D] via-[#9C3346] to-[#5F040D] px-4 py-2 '>
                <ul className="menu text-white space-y-2 font-medium">
                    {isAdmin ? (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/adminDashboard"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <FaHome className="text-xl" /> <span>Admin Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/manageUsers"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <FaUser className="text-xl" /> <span>Manage Users</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/manageProducts"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <FaUser className="text-xl" /> <span>Manage Products</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/approval"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <CiSquareQuestion className="text-xl" /> <span>Approved Adoption</span>
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/user"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <IoIosContact className="text-xl" /> <span>Profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/addPost"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <FaAdjust className="text-xl" /> <span>Post for Adoption</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/userRescue"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <MdOutlineViewInAr className="text-xl" /> <span>Posts rescue</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/adopted"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <MdApproval  className="text-xl" /> <span>Adoption Status</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/missingPets"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                        }`
                                    }
                                >
                                    <VscPreview className="text-xl" /> <span>Add Missing Post</span>
                                </NavLink>
                            </li>
                            <li>
                                    <NavLink to="/dashboard/prescriptions">
                                        <FaFilePrescription /> My Prescriptions
                                    </NavLink>
                            </li>
                        </>
                    )}

                    <div className="divider my-4"></div>

                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#ffffff14] hover:shadow-lg ${isActive ? 'bg-[#ffffff20] shadow-md text-[#FFD3DB]' : ''
                                }`
                            }
                        >
                            <FaHome className="text-xl" /> <span>Home</span>
                        </NavLink>
                    </li>
                </ul>



            </div>

            {/* Main Content */}
            <div className='flex-1 p-8'>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;