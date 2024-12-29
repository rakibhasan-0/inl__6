"use strict";
import React, { useState, useEffect } from "react";
import "./SoundTracks.css";

export default function SoundTracks({ movieTitle, backendUrl }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect to fetch soundtrack when movieTitle or backendUrl changes
  useEffect(() => {
    if (!movieTitle || !backendUrl) {
      console.error("Missing movieTitle or backendUrl");
      return;
    }

    // Function to fetch soundtrack from Spotify API
    const fetchSoundtrack = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching soundtrack for:", movieTitle);
        console.log("Backend URL in SoundTracks:", backendUrl);

        const token = await getAccessToken();
        console.log("Spotify Access Token:", token);

        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          movieTitle
        )}%20soundtrack&type=album&limit=1`;

        const res = await fetch(searchUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Raw search response:", res);
        if (!res.ok) throw new Error("Failed to search for soundtrack");

        const data = await res.json();
        console.log("Spotify Search Response:", data);

        if (data.albums?.items.length > 0) {
          const album = data.albums.items[0];
          const albumId = album.id;
          const albumRes = await fetch(
            `https://api.spotify.com/v1/albums/${albumId}/tracks`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("Raw album response:", albumRes);
          if (!albumRes.ok) throw new Error("Failed to fetch album tracks");

          const albumData = await albumRes.json();
          console.log("Album Tracks Response:", albumData);

          // Remove duplicate tracks
          const uniqueTracks = albumData.items.filter(
            (track, index, self) =>
              index === self.findIndex((t) => t.id === track.id)
          );

          setTracks(uniqueTracks);
        } else {
          setError("No soundtrack found for this movie.");
          setTracks([]);
        }
      } catch (err) {
        console.error("Error fetching soundtrack:", err);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchSoundtrack();
  }, [movieTitle, backendUrl]);

  // Function to fetch Spotify access token
  const getAccessToken = async () => {
    try {
      console.log("Backend URL from the soundtrack:", backendUrl);
      const res = await fetch(`${backendUrl}/api/token`);
      console.log("Token API response:", res);

      if (!res.ok) throw new Error("Failed to retrieve access token");

      const data = await res.json();
      console.log("Token JSON response:", data);
      return data.access_token;
    } catch (err) {
      console.error("Error fetching access token:", err);
      throw err;
    }
  };

  return (
    <div className="soundtracks-container">
      <h2>Soundtrack for: {movieTitle}</h2>
      {loading && <p className="loading">Loading soundtrack...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && tracks.length > 0 && (
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              <span className="track-number">{track.track_number}.</span>
              <span className="track-name">{track.name}</span>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && tracks.length === 0 && <p>No tracks available.</p>}
    </div>
  );
}