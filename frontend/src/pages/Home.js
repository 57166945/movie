import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      <h1>Welcome to MovieReviews</h1>
      <p>Search movies, read community reviews, and add your own.</p>
      <Link to="/search" className="btn btn-primary">Search Movies</Link>
    </div>
  );
}
