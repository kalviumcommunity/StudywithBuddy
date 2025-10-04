// FAISS Helper: Store and search vectors locally
const fs = require('fs');
const path = require('path');
const { getEmbedding } = require('./openai'); // Will throw if called

const VECTOR_STORE_PATH = process.env.VECTOR_STORE_PATH || './vectors';

// Store embeddings for chunks (Gemini does not support embeddings)
exports.embedText = async (chunks, filename) => {
  throw new Error('Embedding not supported with Gemini API');
};

// Search top-k similar chunks (Gemini does not support embeddings)
exports.searchVectors = async (query, filename, k = 3) => {
  throw new Error('Embedding search not supported with Gemini API');
};
