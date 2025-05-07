import { useState } from "react";

const AddReview = () => {
  const [review, setReview] = useState({ user: '', comment: '', rating: 1 });
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess(false);
    fetch('https://pawkie-server.vercel.app/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Review added:', data);
        setReview({ user: '', comment: '', rating: 1 });
        setSuccess(true);
      })
      .catch(error => {
        console.error('Error adding review:', error);
        setSuccess(false);
      });
  };

  return (
    <div className="p-10 bg-gradient-to-br from-[#FFF4E6] to-[#FFE0E0] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-[#FFF4E6]">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-pink-800">Add a Review</h2>

        {success && (
          <div className="mb-4 text-green-600 font-medium text-center">
            ✅ Thank you! Your review has been submitted.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="user"
            value={review.user}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <textarea
            name="comment"
            value={review.comment}
            onChange={handleChange}
            placeholder="Your Review"
            className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          ></textarea>

          <select
            name="rating"
            value={review.rating}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-pink-800 text-[#e2d7c9] p-3 rounded-lg text-lg font-semibold hover:bg-pink-900 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
