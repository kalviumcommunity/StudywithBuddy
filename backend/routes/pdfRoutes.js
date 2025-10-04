// PDF Routes: Upload, Q&A from notes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');
const upload = multer({ dest: 'uploads/' });

// Upload PDF
router.post('/upload', upload.single('pdf'), pdfController.uploadPDF);

// Ask question from PDF
router.post('/ask', pdfController.askFromPDF);

module.exports = router;
