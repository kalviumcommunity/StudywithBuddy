

// Google AI Studio (Gemini) API integration
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`;

// Standard Gemini call: returns model's text output, with retry/backoff on 429
async function getGeminiResponse(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key');
  const maxRetries = 5;
  let attempt = 0;
  let lastErr;
  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n${userPrompt}` }] }
          ]
        }
      );
      console.log('Gemini API raw response:', response.data);
      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      lastErr = err;
      if (err.response && err.response.status === 429) {
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
        await new Promise(res => setTimeout(res, delay));
        attempt++;
      } else {
        throw err;
      }
    }
  }
  throw lastErr || new Error('Failed to get response from Gemini');
}

// Embedding stub (Gemini does not provide public embedding API as of now)
async function getEmbedding(text) {
  throw new Error('Embedding not supported with Gemini API');
}

module.exports = { getGeminiResponse, getEmbedding };
