const express = require('express');

const router = express.Router();
const aiController = require('../controllers/aiController');

// Unified and clear AI endpoints
router.post('/doubt', aiController.solveDoubt); // POST /api/ai/doubt
router.post('/flashcard', aiController.flashcards); // POST /api/ai/flashcard
router.post('/quiz', aiController.quiz); // POST /api/ai/quiz
router.post('/studyplan', aiController.studyPlan); // POST /api/ai/studyplan

module.exports = router;
