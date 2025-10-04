const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


// Use the correct Gemini model and endpoint for v1beta API
// Updated to use the current available model instead of deprecated gemini-pro
const GEMINI_MODEL = 'models/gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`;

async function callGemini(systemPrompt, userPrompt) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n${userPrompt}` }] }
        ]
      }
    );
    // Gemini returns the text in response.data.candidates[0].content.parts[0].text
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    throw new Error(err.response?.data?.error?.message || err.message);
  }
}

module.exports = { callGemini };