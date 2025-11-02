import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Search(){
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  async function submit(e){
    e.preventDefault();
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tmdb/search?q=${encodeURIComponent(q)}`);
    setResults(res.data.results || []);
  }

  const sampleMovies = [
    {
      id: 1,
      title: 'Inception',
      img: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
      rating: '8.8',
      reviews: '2.1M',
    },
    {
      id: 2,
      title: 'The Dark Knight',
      img: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: '9.0',
      reviews: '2.5M',
    },
    {
      id: 3,
      title: 'Interstellar',
      img: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      rating: '8.6',
      reviews: '1.9M',
    },
    {
      id: 4,
      title: 'Avatar',
      img: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
      rating: '7.8',
      reviews: '1.3M',
    },
  ];


 return (
    <div className="container mt-4">
      <h2>Search</h2>

      <form onSubmit={submit} className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Movie title..."
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>

      {/* show results if search done */}
      {results.length > 0 ? (
        results.map(m => (
          <div className="card mb-2" key={m.id}>
            <div className="card-body d-flex justify-content-between">
              <div>
                <h5>{m.title}</h5>
                <p className="text-muted">{m.overview?.slice(0, 120)}...</p>
              </div>
              <Link to={`/movie/${m.id}`} className="btn btn-outline-primary">View</Link>
            </div>
          </div>
        ))
      ) : (
        <>
          <h4 className="mt-4 mb-3">🔥 Popular Picks</h4>
          <div className="row">
            {sampleMovies.map(movie => (
              <div className="col-sm-6 col-md-3 mb-4" key={movie.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={movie.img}
                    className="card-img-top"
                    alt={movie.title}
                    style={{ height: '320px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h6 className="card-title mb-1">{movie.title}</h6>
                    <p className="text-muted small mb-1">
                      ⭐ {movie.rating} | {movie.reviews} reviews
                    </p>
                    <button className="btn btn-sm btn-outline-primary disabled">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}