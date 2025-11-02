import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile(){
  const [reviews, setReviews] = useState([]);

  useEffect(()=>{
    async function load(){
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`);
      setReviews(res.data.filter(r => r.authorId === 'demo-user'));
    }
    load();
  }, []);

  return (
    <div>
      <h2>My Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(r => (
        <div key={r.id} className="border rounded p-2 mb-2">
          <strong>{r.movieTitle || r.movieId}</strong> — {r.rating}/10
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  );
}
