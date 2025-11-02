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

  return (
    <div>
      <h2>Search</h2>
      <form onSubmit={submit} className="mb-3">
        <div className="input-group">
          <input className="form-control" value={q} onChange={e => setQ(e.target.value)} placeholder="Movie title..." />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>
      {results.map(m => (
        <div className="card mb-2" key={m.id}>
          <div className="card-body d-flex justify-content-between">
            <div>
              <h5>{m.title}</h5>
              <p className="text-muted">{m.overview?.slice(0,120)}...</p>
            </div>
            <Link to={`/movie/${m.id}`} className="btn btn-outline-primary">View</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
