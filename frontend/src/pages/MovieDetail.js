import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function MovieDetail(){
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(()=>{
    async function load(){
      const [mRes, rRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tmdb/movie/${id}`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews?movieId=${id}`)
      ]);
      setMovie(mRes.data);
      setReviews(rRes.data);
    }
    load();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <Link to={`/add-review/${id}`} className="btn btn-success mb-3">Add Review</Link>
      <h4>Reviews</h4>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(r => (
        <div key={r.id} className="border rounded p-2 mb-2">
          <strong>{r.authorName || r.authorId}</strong> — {r.rating}/10
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  );
}
