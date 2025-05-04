import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdoptionApproval = () => {
  const [pets, setPets] = useState([]);

  const fetchPets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/adoptedPets');
      setPets(res.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/adoptedPets/${id}`, { status: true });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Request Approved!',
        showConfirmButton: false,
        timer: 1500
      });
      fetchPets();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This adoption request will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9C3346',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/adoptedPets/${id}`).then(() => {
          Swal.fire('Rejected!', 'The request has been deleted.', 'success');
          fetchPets();
        });
      }
    });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#FFE8DA] via-[#FFD6BE] to-[#FFE3D0] min-h-screen text-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#9C3346]">Adoption Requests</h2>
        <h2 className="text-xl font-semibold text-[#9C3346]">
          Total Requests: {pets.length}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white bg-opacity-10 backdrop-blur-md">
        <table className="table w-full text-black">
          <thead className="text-lg bg-[#9C3346] bg-opacity-80 text-white">
            <tr>
              <th>#</th>
              <th>Pet</th>
              <th>Breed</th>
              <th>Owner</th>
              <th>Adopter</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, index) => (
              <tr key={pet._id} className="hover:bg-[#ffffff15] transition">
                <td>{index + 1}</td>
                <td>{pet.petName}</td>
                <td>{pet.petBreed}</td>
                <td>{pet.ownerName}</td>
                <td>{pet.adopterName}</td>
                <td>{pet.adopterPhone}</td>
                <td className="font-semibold">
                  {pet.status ? (
                    <span className="text-green-400">Approved</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    {!pet.status && (
                      <button
                        onClick={() => handleAccept(pet._id)}
                        className="btn bg-[#5F040D] hover:bg-[#9C3346] text-white transition-all duration-300 px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => !pet.status && handleReject(pet._id)}
                      className={`btn px-3 py-1 rounded transition duration-300 ${
                        pet.status
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-700 text-white'
                      }`}
                      disabled={pet.status}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionApproval;
