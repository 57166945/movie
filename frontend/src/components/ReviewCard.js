import React from 'react';
import { Link } from 'react-router-dom';

export default function ReviewCard({ review, onDelete, currentUserId }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">{review.movieTitle} — {review.rating}/10</h5>
        <h6 className="card-subtitle mb-2 text-muted">By {review.authorName || review.authorId}</h6>
        <p className="card-text">{review.text}</p>
        <div>
          <Link to={`/movie/${review.movieId}`} className="btn btn-sm btn-outline-primary me-2">View Movie</Link>
          {currentUserId === review.authorId && (
            <>
              <Link to={`/review/${review.id}/edit`} className="btn btn-sm btn-warning me-2">Edit</Link>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(review.id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
