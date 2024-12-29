// backend/server.js
import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT || 5005;

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// In-memory cache for the access token
let accessToken = null;
let tokenExpiresAt = null;

// Function to get access token with caching
const getAccessToken = async () => {
    const currentTime = Date.now();

    if (accessToken && tokenExpiresAt && currentTime < tokenExpiresAt) {
        console.log("Reusing cached access token.");
        return accessToken;
    }

    console.log("Fetching new access token...");
    const tokenURL = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await fetch(tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${credentials}`,
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error fetching access token:', errorData);
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched new access token:', data.access_token);
        accessToken = data.access_token;
        tokenExpiresAt = currentTime + (data.expires_in - 300) * 1000;
        return accessToken;
    } catch (error) {
        console.error('Error in getAccessToken:', error.message);
        throw error;
    }
};


// API endpoint to get Spotify access token
app.get('/api/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve access token.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
