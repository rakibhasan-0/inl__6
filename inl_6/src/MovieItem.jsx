"use strict";
import React, { useState } from "react";
import "./MovieItem.css";
import SoundTracks from "./SoundTracks"; 

// MovieItem component to display individual movie details
function MovieItem({ movie, onSelect, isDetailView }) {
  const [showSoundtrack, setShowSoundtrack] = useState(false);
 
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";


  console.log("Backend URL:", BACKEND_URL);

  // Extract IMDb rating from movie ratings
  const imdbRating =
    movie.Ratings?.find((rating) => rating.Source === "Internet Movie Database")
      ?.Value || "N/A";

  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/250";


  // Toggle the display of the soundtrack component
  const handleGetSoundtrack = () => {
    setShowSoundtrack((prev) => !prev);
  };

  return (
    <div className={isDetailView ? "movie-detail" : "movie-item"}>
      <img src={poster} alt={`${movie.Title} Poster`} />
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
            
            {/* Button to show or hide soundtrack */}
            <button onClick={handleGetSoundtrack}>
              {showSoundtrack ? "Hide Soundtrack" : "Get Soundtrack"}
            </button>

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
