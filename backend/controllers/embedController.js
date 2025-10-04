// Embedding Controller: For manual embedding endpoints (optional)
const { embedText } = require('../utils/faissHelper');

exports.embedChunks = async (req, res) => {
  const { chunks, filename } = req.body;
  try {
    await embedText(chunks, filename);
    res.json({ message: 'Chunks embedded', count: chunks.length });
  } catch (err) {
    res.status(500).json({ error: 'Embedding error', details: err.message });
  }
};
