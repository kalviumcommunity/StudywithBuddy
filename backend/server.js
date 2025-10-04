// Study Buddy AI – Lightweight Full-Stack AI Agent Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const embedRoutes = require('./routes/embedRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes); // Register/Login
app.use('/api/ai', aiRoutes); // Doubt-solving, study plan, flashcards, quiz
app.use('/api/pdf', pdfRoutes); // PDF upload, Q&A from notes
app.use('/api/embed', embedRoutes); // Embedding endpoints

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Study Buddy AI server running!' });
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Study Buddy AI server listening on port ${PORT}`);
});

