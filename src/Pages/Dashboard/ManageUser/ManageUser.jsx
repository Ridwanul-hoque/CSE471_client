import React from 'react';
import useSecure from '../../../Hooks/useSecure';
import { useQuery } from '@tanstack/react-query';
import { FaTrash, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageUser = () => {
  const axiosSecure = useSecure();
  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const handleAdmin = user => {
    axiosSecure.patch(`/users/admin/${user._id}`).then(res => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${user.name} is an Admin Now!`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

  const handleDeleteUser = user => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9C3346',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then(res => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been removed.',
              icon: 'success'
            });
          }
        });
      }
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#FFE8DA] via-[#FFD6BE] to-[#FFE3D0] min-h-screen text-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#9C3346]">All Users</h2>
        <h2 className="text-xl font-semibold text-[#9C3346]">
          Total Users: {users.length}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white bg-opacity-10 backdrop-blur-md">
        <table className="table w-full text-black">
          <thead className="text-lg bg-[#9C3346] bg-opacity-80 text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-[#ffffff15] transition">
                <td>{index + 1}</td>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === 'admin' ? (
                    <span className="text-green-300 font-semibold">Admin</span>
                  ) : (
                    <button
                      onClick={() => handleAdmin(user)}
                      className="btn bg-[#5F040D] hover:bg-[#9C3346] text-white transition-all duration-300"
                    >
                      <FaUsers />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="btn btn-sm hover:bg-red-700 text-red-400 hover:text-white transition duration-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
