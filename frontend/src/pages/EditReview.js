import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditReview() {
  const { id } = useParams(); // review id
  const navigate = useNavigate();

  const [form, setForm] = useState({ authorName: "", rating: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/reviews`
        );
        const found = res.data.find((r) => r.id === id);
        if (!found) return setError("Review not found");
        setForm({
          authorName: found.authorName,
          rating: found.rating,
          text: found.text,
        });
      } catch (err) {
        console.error("Load review failed:", err);
        setError("Failed to load review.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.rating || !form.text)
      return setError("Rating and text required.");

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/reviews/${id}`,
        {
          rating: parseFloat(form.rating),
          text: form.text,
        }
      );
      alert("Review updated!");
      navigate(-1); // back to previous page
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update review.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Review</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={form.authorName}
            disabled
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
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}
