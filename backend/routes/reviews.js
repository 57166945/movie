const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
const router = express.Router();

// Initialize Firebase Admin using GOOGLE_APPLICATION_CREDENTIALS env var (or ADC)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } catch (e) {
    console.error('Firebase Admin initialization failed:', e.message);
    // keep running to show errors on endpoint calls
  }
}

const db = admin.firestore();
const reviewsCol = db.collection('reviews');

// Helper: sanitize and validate incoming review data
function validateReviewPayload(body) {
  const errors = [];
  if (!body) errors.push('request body missing');
  if (!body.movieId) errors.push('movieId is required');
  if (body.rating === undefined || body.rating === null) errors.push('rating is required');
  if (!body.authorId && !body.authorName) errors.push('authorId or authorName is required');
  return errors;
}

// GET reviews (optional ?movieId=)
router.get('/', async (req, res) => {
  try {
    let q = reviewsCol;
    if (req.query.movieId) q = q.where('movieId', '==', req.query.movieId);
    // order after filtering — Firestore may require an index for complex combos
    q = q.orderBy('createdAt', 'desc');

    const snap = await q.get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    // Detect index error and surface helpful link
    if (err && err.details && typeof err.details === 'string' && err.details.includes('create_composite')) {
      const msg = 'Firestore query requires a composite index. See error details for link to create it in Firebase Console.';
      console.error('Firestore index required:', err.details);
      return res.status(500).json({ error: msg, details: err.details });
    }
    console.error('Failed to load reviews:', err.message || err);
    res.status(500).json({ error: 'Failed to load reviews', details: err.message || err });
  }
});

// POST create review
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    console.log('📨 Incoming review payload:', payload);

    const errors = validateReviewPayload(payload);
    if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

    // cast rating to number and set timestamps via server
    const rating = Number(payload.rating);
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    const review = {
      movieId: String(payload.movieId),
      movieTitle: payload.movieTitle || '',
      rating: isNaN(rating) ? null : rating,
      text: payload.text || '',
      authorId: payload.authorId || null,
      authorName: payload.authorName || '',
      createdAt,
      updatedAt: createdAt
    };

    const ref = await reviewsCol.add(review);
    const saved = await ref.get();
    res.status(201).json({ id: saved.id, ...saved.data() });
  } catch (err) {
    console.error('Failed to create review:', err.message || err);
    // If Firestore permission denied, make message clear
    if (err.message && err.message.toLowerCase().includes('permission')) {
      return res.status(500).json({ error: 'Firestore permission error. Check service account and rules.', details: err.message });
    }
    res.status(500).json({ error: 'Failed to create review', details: err.message || err });
  }
});

// PUT update review (owner checks to add later)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { rating, text } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing review id' });
    await reviewsCol.doc(id).update({ rating, text, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const doc = await reviewsCol.doc(id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Failed to update review:', err.message || err);
    res.status(500).json({ error: 'Failed to update review', details: err.message || err });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing review id' });
    await reviewsCol.doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete review:', err.message || err);
    res.status(500).json({ error: 'Failed to delete review', details: err.message || err });
  }
});

module.exports = router;
