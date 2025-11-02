const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

if (!TMDB_KEY) console.warn('⚠️ TMDB_API_KEY missing in .env file');

// SEARCH (returns full TMDb data object so existing frontend works)
router.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q (search query)' });

  try {
    const r = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: {
        api_key: TMDB_KEY,
        query: q,
        include_adult: false,
        language: 'en-US'
      }
    });
    // return the same shape your frontend expects (r.data)
    res.json(r.data);

  } catch (err) {
    console.error('TMDb Search Error:', err?.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(500).json({ error: 'TMDb search failed', details: err?.response?.data || err.message, status });
  }
});

// MOVIE DETAILS
router.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ error: 'Missing movie ID' });

  try {
    const r = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
      params: {
        api_key: TMDB_KEY,
        language: 'en-US',
        append_to_response: 'credits,videos,images'
      }
    });

    // TMDb may return a payload with success:false when not found
    if (r.data && r.data.success === false) {
      return res.status(404).json({ error: 'Movie not found on TMDb', details: r.data.status_message });
    }

    res.json(r.data);
  } catch (err) {
    console.error('TMDb Movie Fetch Error:', err?.response?.data || err.message);
    // surface the TMDb JSON if present
    const details = err.response?.data || err.message;
    res.status(500).json({ error: 'TMDb fetch failed', details });
  }
});

module.exports = router;
