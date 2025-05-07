import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../Providers/AuthProviders';

const MissingPetsData = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get('https://pawkie-server.vercel.app/api/missing-pet')
        .then(res => {
          const userPosts = res.data.filter(post => post.userEmail === user.email);
          setPosts(userPosts);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://pawkie-server.vercel.app/api/missing-pet/${id}`);
      if (response.status === 200) {
        setPosts(posts.filter(post => post._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="p-6 bg-[#FFE8DA] min-h-screen">
      <h2 className="text-3xl font-bold text-[#5F040D] mb-6 text-center">Your Missing Pet Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No missing pet posts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#FFD6BE] shadow rounded-lg overflow-hidden bg-white">
            <thead className="bg-[#FFD6BE] text-[#5F040D]">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Posted At</th>
                <th className="p-3 text-left">Comments</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} className="border-t border-[#FFE8DA] hover:bg-[#FFF3EC] transition">
                  <td className="p-3">
                    <img src={post.image} alt="Pet" className="w-20 h-20 object-cover rounded-md" />
                  </td>
                  <td className="p-3 whitespace-pre-line text-gray-700">{post.description}</td>
                  <td className="p-3 text-gray-600">{new Date(post.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-gray-700">
                    {post.comments?.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {post.comments.map((comment, idx) => (
                          <li key={idx}>
                            <strong className="text-[#9C3346]">{comment.userName}:</strong> {comment.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic text-gray-500">No comments</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MissingPetsData;
