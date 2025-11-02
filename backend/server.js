require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tmdbRoutes = require('./routes/tmdb');
const reviewsRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json());

// simple request logger (keeps it readable and useful)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/tmdb', tmdbRoutes);
app.use('/api/reviews', reviewsRoutes);

// health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || "https://github.com/57166945/movie.git";
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
