const multer = require('multer');
const path = require('path');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Mock document storage (replace with FAISS + MongoDB in production)
let documents = [];

// Upload PDF and extract text
const fs = require('fs');
const pdfParse = require('pdf-parse');
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }
    // Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    let pdfText = '';
    try {
      const data = await pdfParse(dataBuffer);
      pdfText = data.text;
    } catch (err) {
      pdfText = '';
    }
    // Create document entry
    const docId = Date.now().toString();
    documents.push({
      id: docId,
      filename: req.file.filename,
      path: req.file.path,
      content: pdfText
    });
    res.json({ 
      message: 'PDF uploaded successfully',
      docId: docId
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

const { getGeminiResponse } = require('../utils/openai');
const prompts = require('../utils/prompts');

// Ask question from PDF using AI with context
exports.askFromPDF = async (req, res) => {
  try {
    const { docId, question } = req.body;
    // Find document
    const doc = documents.find(d => d.id === docId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (!doc.content) {
      return res.status(404).json({ message: 'No content extracted from PDF' });
    }
    // Prepare prompt with PDF content and question
    const systemPrompt = prompts.PDF_QA.replace('{pdf_content}', doc.content).replace('{question}', question);
    // Get AI answer
    const answer = await getGeminiResponse(systemPrompt, '');
    res.json({
      answer: answer.trim(),
      sources: [doc.filename]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing question', details: error.message });
  }
};
