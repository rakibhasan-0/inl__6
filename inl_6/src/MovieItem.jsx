"use strict";
import React, { useState } from "react";
import "./MovieItem.css";
import SoundTracks from "./SoundTracks"; 

function MovieItem({ movie, onSelect, isDetailView }) {
  const [showSoundtrack, setShowSoundtrack] = useState(false); 
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

  console.log("Backend URL:", BACKEND_URL);

  const imdbRating =
    movie.Ratings?.find((rating) => rating.Source === "Internet Movie Database")
      ?.Value || "N/A";

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/250"; // Updated placeholder size

  const handleGetSoundtrack = () => {
    setShowSoundtrack((prev) => !prev); // Toggle soundtrack visibility
  };

  return (
    <div className={isDetailView ? "movie-detail" : "movie-item"}>
      <img
        src={poster}
        alt={`${movie.Title} Poster`}
        /* Removed inline style */
      />
      <div>
        <h2>
          {movie.Title} ({movie.Year})
        </h2>
        {isDetailView ? (
          <>
            <p>
              <strong>Runtime:</strong> {movie.Runtime || "N/A"}
            </p>
            <p>
              <strong>IMDB Rating:</strong> {imdbRating}
            </p>
            <button onClick={handleGetSoundtrack}>
              {showSoundtrack ? "Hide Soundtrack" : "Get Soundtrack"}
            </button>
            {/* Only render SoundTracks component when showSoundtrack is true */}
            {showSoundtrack && (
              <SoundTracks movieTitle={movie?.Title} backendUrl={BACKEND_URL} />
            )}
          </>
        ) : (
          <button onClick={onSelect}>View Details</button>
        )}
      </div>
    </div>
  );
}

export default MovieItem;
