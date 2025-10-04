const express = require('express');
const router = express.Router();

// Placeholder for FAISS embedding routes
router.get('/health', (req, res) => {
  res.json({ message: 'Embedding service ready' });
});

module.exports = router;
