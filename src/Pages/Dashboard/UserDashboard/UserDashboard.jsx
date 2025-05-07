import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../Providers/AuthProviders';
import { FaEdit, FaHistory, FaMedal, FaPrescription, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const UserDashboard = () => {
    const { user, loading: authLoading, updateUserProfile } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        image: '',
    });

    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.email) return;

            try {
                const response = await fetch(`https://pawkie-server.vercel.app/users/${user.email}`);
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load your profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchUserData();
        }
    }, [user, authLoading]);

    const handleEditProfile = () => {
        setFormData({
            name: userData.name || '',
            phone: userData.phone || '',
            image: userData.image || '',
        });
        setShowEditModal(true);
    };

    const handleUpdateSuccess = (updatedData) => {
        setUserData(updatedData);
        setShowEditModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalError(null);

        try {
            await updateUserProfile(formData.name, formData.image);

            const response = await fetch(`https://pawkie-server.vercel.app/users/${userData.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    email: userData.email
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUserResponse = await fetch(`https://pawkie-server.vercel.app/users/${userData.email}`);
            const updatedUserData = await updatedUserResponse.json();

            handleUpdateSuccess(updatedUserData);

            if (window.Swal) {
                window.Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Profile updated successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setModalError('Failed to update profile. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!userData) return <div className="text-center p-4">No user data found</div>;

    return (
        
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-[#5F040D] text-white p-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">My Dashboard</h1>
                            <button
                                onClick={handleEditProfile}
                                className="bg-[#F7B385] text-[#49312C] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e9a776] transition-all"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:flex gap-6">
                        <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-[#F7B385]">
                                <img
                                    src={userData.image || user.photoURL || "https://placehold.co/400x400?text=Profile"}
                                    alt={userData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-center">{userData.name || user.displayName}</h2>
                            <p className="text-gray-600 text-center">{userData.email}</p>
                            <p className="text-gray-600 text-center">{userData.phone}</p>

                            <div className="mt-4 bg-[#F7B385] bg-opacity-20 p-3 rounded-lg w-full">
                                <div className="flex items-center justify-center gap-2">
                                    <FaMedal className="text-[#F7B385]" />
                                    <p className="font-semibold">Loyalty Points: {userData.loyaltyPoints || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaHistory className="text-[#49312C]" />
                                        <h3 className="font-semibold">Adoption History</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {userData.adoptions?.length ?
                                            `You have adopted ${userData.adoptions.length} pets` :
                                            "You haven't adopted any pets yet"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaShoppingCart className="text-[#49312C]" />
                                        <h3 className="font-semibold">Purchase History</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {userData.purchases?.length ?
                                            `You have made ${userData.purchases.length} purchases` :
                                            "You haven't made any purchases yet"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg ">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaHistory className="text-[#49312C]" />
                                        <h3 className="font-semibold">Care Center Bookings</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {userData.bookings?.length ?
                                            `You have ${userData.bookings.length} bookings` :
                                            "You don't have any care center bookings"}
                                    </p>
                                </div>
                                <Link to={"/dashboard/prescriptions"} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaPrescription className="text-[#49312C]" />
                                        <h3 className="font-semibold">Prescription</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {userData.bookings?.length ?
                                            `You have ${userData.bookings.length} bookings` :
                                            "You don't have any care center bookings"}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold text-[#49312C]">Edit Profile</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {modalError && (
                                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                    {modalError}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49312C] focus:outline-none"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49312C] focus:outline-none"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Profile Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#49312C] focus:outline-none"
                                    placeholder="Enter image URL (imgbb preferred)"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    className={`px-4 py-2 bg-[#49312C] text-white rounded-lg hover:bg-[#3a2722] transition-all ${modalLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {modalLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;