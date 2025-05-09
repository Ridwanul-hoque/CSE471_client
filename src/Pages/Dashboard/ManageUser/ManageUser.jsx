import React from 'react';
import useSecure from '../../../Hooks/useSecure';
import { useQuery } from '@tanstack/react-query';
import { FaTrash, FaUsers, FaUserMd } from 'react-icons/fa';
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
    axiosSecure.patch(`/users/admin/${user._id}`)
      .then(res => {
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.name} is now an Admin!`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
  };

  const handleDoctor = user => {
    axiosSecure.patch(`/users/doctor/${user._id}`)
      .then(res => {
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.name} is now a Doctor!`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
  };

  const handleDeleteUser = user => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success"
              });
            }
          });
      }
    });
  };

  return (
    <div>
      <div className='flex justify-evenly my-4'>
        <h2 className='text-3xl'>All Users</h2>
        <h2 className='text-3xl'>Total Users: {users.length}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Make Admin</th>
              <th>Make Doctor</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className='capitalize'>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleAdmin(user)}
                      className="btn bg-[#D1A054] text-white"
                      disabled={user.role === 'admin' || user.role === 'doctor'}
                    >
                      {user.role === 'admin' ? 'Admin' : <FaUsers />}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDoctor(user)}
                      className="btn bg-[#4CAF50] text-white"
                      disabled={user.role === 'doctor' || user.role === 'admin'}
                    >
                      {user.role === 'doctor' ? 'Doctor' : <FaUserMd />}
                    </button>
                  </td>

                  <td>
                    <button onClick={() => handleDeleteUser(user)} className="btn btn-ghost btn-xs">
                      <FaTrash className='text-red-600' />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
