import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ text: "", rating: "" });
  const [editing, setEditing] = useState(null); // review id being edited

  // ✅ Listen for Firebase auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ✅ Load movie + reviews
  useEffect(() => {
    async function load() {
      try {
        const [mRes, rRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tmdb/movie/${id}`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews?movieId=${id}`),
        ]);
        setMovie(mRes.data);
        setReviews(rRes.data);
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    load();
  }, [id]);

  // ✅ Handle Add or Update
  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return alert("Please log in first.");

    try {
      if (editing) {
        // update
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${editing}`, {
          text: form.text,
          rating: form.rating,
        });
      } else {
        // add
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`, {
          movieId: id,
          authorId: user.uid,
          authorName: user.displayName || user.email,
          text: form.text,
          rating: form.rating,
        });
      }

      // reload reviews
      const rRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews?movieId=${id}`);
      setReviews(rRes.data);

      // reset
      setForm({ text: "", rating: "" });
      setEditing(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong while submitting your review.");
    }
  }

  // ✅ Edit existing review
  function handleEdit(r) {
    setEditing(r.id);
    setForm({ text: r.text, rating: r.rating });
  }

  // ✅ Delete review
  async function handleDelete(id) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${id}`);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  if (!movie) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      {/* ===== Movie Details ===== */}
      <div className="row mb-4">
        <div className="col-md-4">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="img-fluid rounded shadow-sm"
            />
          ) : (
            <div className="bg-secondary text-white text-center py-5 rounded">No Image</div>
          )}
        </div>
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <p className="text-muted">
            ⭐ {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)
          </p>
          <p>{movie.overview}</p>
        </div>
      </div>

      <hr />

      {/* ===== Add/Edit Review Form ===== */}
      <div className="card bg-dark text-light mb-4">
        <div className="card-body">
          <h5>{editing ? "✏️ Edit Review" : "💬 Add Review"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Rating (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Review</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit">
              {editing ? "Update Review" : "Submit Review"}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditing(null);
                  setForm({ text: "", rating: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ===== Reviews List ===== */}
      <h4 className="mb-3">User Reviews</h4>
      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => (
        <div key={r.id} className="border rounded p-3 mb-3 bg-light">
          <strong>{r.authorName}</strong> — <span>⭐ {r.rating}/10</span>
          <p>{r.text}</p>

          {user && user.uid === r.authorId && (
            <div>
              <button
                className="btn btn-sm btn-outline-success me-2"
                onClick={() => handleEdit(r)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
