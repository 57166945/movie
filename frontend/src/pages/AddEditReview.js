import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddEditReview() {
  const { id } = useParams(); // TMDb movie ID
  const navigate = useNavigate();

  const [form, setForm] = useState({
    authorName: '',
    rating: '',
    text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit review to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!form.authorName || !form.rating || !form.text) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/reviews`,
        {
          movieId: id,
          authorName: form.authorName,
          rating: parseFloat(form.rating),
          text: form.text
        }
      );

      console.log('Review added:', res.data);
      alert('Review submitted successfully!');
      navigate(`/movie/${id}`);
    } catch (err) {
      console.error('Error adding review:', err);
      setError(
        err.response?.data?.message ||
        'Something went wrong while submitting your review.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            name="authorName"
            value={form.authorName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rating (1–10)</label>
          <input
            type="number"
            className="form-control"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Review</label>
          <textarea
            className="form-control"
            name="text"
            rows="4"
            value={form.text}
            onChange={handleChange}
            placeholder="Write your thoughts..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
