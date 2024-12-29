"use strict";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import MovieItem from "./MovieItem";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 41059430;

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };


  const handleSelectMovie = async (movie) => {
    setSelectedMovie(null);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setSelectedMovie(data);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching movie details.");
    }
    setLoading(false);
  };

  const handleBack = () => {
    setSelectedMovie(null);
    setError(null);
  };

  return (
    <div className="App">

      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {selectedMovie ? (
        <div>
          <button onClick={handleBack}>Back to Movies</button>
          <MovieItem movie={selectedMovie} isDetailView={true} />
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieItem
              key={movie.imdbID}
              movie={movie}
              onSelect={() => handleSelectMovie(movie)}
              isDetailView={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;