import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { AuthContext } from '../../../Providers/AuthProviders';

const MissingPetsData = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get('http://localhost:5000/api/missing-pet')
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
      const response = await axios.delete(`http://localhost:5000/api/missing-pet/${id}`);
      if (response.status === 200) {
        setPosts(posts.filter(post => post._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Missing Pet Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Posted At</th>
              <th className="border p-2">Comments</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td className="border p-2">
                  <img src={post.image} alt="Pet" className="w-20 h-20 object-cover" />
                </td>
                <td className="border p-2 whitespace-pre-line">{post.description}</td>
                <td className="border p-2">{new Date(post.createdAt).toLocaleString()}</td>
                <td className="border p-2">
                  {post.comments?.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {post.comments.map((comment, idx) => (
                        <li key={idx}>
                          <strong>{comment.userName}:</strong> {comment.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No comments'
                  )}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MissingPetsData;
