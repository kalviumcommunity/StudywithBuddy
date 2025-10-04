// AI Controller: Handles doubt-solving, study plan, flashcards, quiz
const { getGeminiResponse } = require('../utils/openai');
const prompts = require('../utils/prompts');

// Doubt-solving
exports.solveDoubt = async (req, res) => {
  const { question, subject } = req.body;
  try {
    const answer = await getGeminiResponse(prompts.DOUBT_SOLVER, `Subject: ${subject}\nQuestion: ${question}`);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Gemini error', details: err.message });
  }
};

// Study plan
exports.studyPlan = async (req, res) => {
  const { subject, days } = req.body;
  try {
    const planText = await getGeminiResponse(prompts.STUDY_PLANNER, `Subject: ${subject}\nDays: ${days}`);
    // Robustly extract JSON array/object from code block if present
    function extractJsonFromCodeBlock(text) {
      let cleaned = text
        .replace(/^[\s\r\n]*```[ \t]*json[ \t]*[\r\n]+/i, '') // opening marker
        .replace(/[\r\n]+```[\s\r\n]*$/i, '') // closing marker
        .trim();
      // Try to extract the first JSON object or array
      if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
        const match = cleaned.match(/({[\s\S]*})|(\[[\s\S]*\])/);
        if (match) cleaned = match[0];
      }
      return cleaned;
    }
    let cleaned = extractJsonFromCodeBlock(planText);
    console.log('Cleaned study plan string:', cleaned);
    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch (e) {
      plan = cleaned.split('\n').filter(Boolean);
    }
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: 'Gemini error', details: err.message });
  }
};

// Flashcards
exports.flashcards = async (req, res) => {
  const topic = req.body.topic || req.body.text;
  const count = req.body.count || 5;
  try {
    console.log('Flashcards endpoint hit');
    console.log('Request body:', req.body);
    const flashcardsText = await getGeminiResponse(prompts.FLASHCARD_GENERATOR, `Create ${count} flashcards for topic: ${topic}`);
    console.log('Gemini flashcardsText:', flashcardsText);
    let flashcards;
    // Robustly extract JSON array from code block if present
    function extractJsonArrayFromCodeBlock(text) {
      // Remove all code block markers (```json, ```), even with whitespace/newlines
      let cleaned = text
        .replace(/^[\s\r\n]*```[ \t]*json[ \t]*[\r\n]+/i, '') // opening marker
        .replace(/[\r\n]+```[\s\r\n]*$/i, '') // closing marker
        .trim();
      // If still not valid JSON, try to extract the first JSON array in the string
      if (!cleaned.startsWith('[')) {
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) cleaned = match[0];
      }
      return cleaned;
    }
    let cleaned = extractJsonArrayFromCodeBlock(flashcardsText);
    console.log('Cleaned flashcards string:', cleaned);
    try {
      flashcards = JSON.parse(cleaned);
    } catch (e) {
      // Try to parse plain text into Q&A pairs
      const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      flashcards = [];
      let q = '', a = '';
      for (let i = 0; i < lines.length; i++) {
        if (/^Q\d+:?/i.test(lines[i])) {
          if (q && a) flashcards.push({ question: q, answer: a });
          q = lines[i].replace(/^Q\d+:?/i, '').trim();
          a = '';
        } else if (/^A\d+:?/i.test(lines[i])) {
          a = lines[i].replace(/^A\d+:?/i, '').trim();
        } else if (!q) {
          q = lines[i];
        } else if (!a) {
          a = lines[i];
        }
      }
      if (q && a) flashcards.push({ question: q, answer: a });
      if (!Array.isArray(flashcards) || !flashcards.length) flashcards = [];
    }
    console.log('Parsed flashcards:', flashcards);
    res.json({ flashcards });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Gemini error', details: err.message });
  }
};

// Quiz
exports.quiz = async (req, res) => {
  const topic = req.body.topic || req.body.text;
  const count = req.body.count || 5;
  try {
    const quizText = await getGeminiResponse(prompts.QUIZ_GENERATOR, `Create ${count} MCQs for topic: ${topic}`);
    // Robustly extract JSON array/object from code block if present
    function extractJsonFromCodeBlock(text) {
      let cleaned = text
        .replace(/^[\s\r\n]*```[ \t]*json[ \t]*[\r\n]+/i, '') // opening marker
        .replace(/[\r\n]+```[\s\r\n]*$/i, '') // closing marker
        .trim();
      // Try to extract the first JSON object or array
      if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
        const match = cleaned.match(/({[\s\S]*})|(\[[\s\S]*\])/);
        if (match) cleaned = match[0];
      }
      return cleaned;
    }
    let cleaned = extractJsonFromCodeBlock(quizText);
    console.log('Cleaned quiz string:', cleaned);
    let quiz;
    try {
      quiz = JSON.parse(cleaned);
    } catch (e) {
      quiz = cleaned.split('\n').filter(Boolean);
    }
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: 'Gemini error', details: err.message });
  }
};
