import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <section className="home-section">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>Welcome to 🎬 CineRate</h1>
        <p>
          Discover trending movies, explore ratings, and share your thoughts with the community.
        </p>
        <Link to="/search" className="btn-main">
          Explore Movies
        </Link>
      </div>
    </section>
  );
}
