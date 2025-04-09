const AllAdoptions = ({ pets }) => {
  if (!pets || pets.length === 0) {
    return (
      <div className="text-center text-[#49312C] font-medium my-10">
        No adoption posts yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#49312C] text-center mb-10">
      <span className="text-[#000000]">🐾</span>
      All Adoption Posts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="bg-[#FFE3D0] p-5 rounded-lg shadow-lg border border-[#49312C]"
          >
            <div className="text-[#49312C]">
              <h2 className="text-2xl font-bold mb-2">{pet.petName}</h2>
              <p><strong>Breed:</strong> {pet.petBreed}</p>
              <p><strong>Color:</strong> {pet.petColor}</p>
              <p><strong>Age:</strong> {pet.petAge}</p>
              <hr className="my-3" />
              <p><strong>Owner:</strong> {pet.ownerName}</p>
              <p><strong>Contact:</strong> {pet.contact}</p>
              <p><strong>Address:</strong> {pet.address}</p>
            </div>

            {pet.images?.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap justify-center">
                {pet.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${imgUrl}`}
                    alt="Pet"
                    className="h-24 w-24 object-cover rounded shadow"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAdoptions;
