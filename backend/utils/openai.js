

// OpenAI API integration (fallback from Gemini due to API instability)
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY; // Use Gemini key as fallback if OpenAI not set
const OPENAI_MODEL = 'gpt-3.5-turbo'; // Using GPT-3.5-turbo as it's more cost-effective
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Standard OpenAI call: returns model's text output, with retry/backoff on 429
async function getGeminiResponse(systemPrompt, userPrompt) {
  if (!OPENAI_API_KEY) throw new Error('Missing API key (OPENAI_API_KEY or GEMINI_API_KEY)');
  const maxRetries = 5;
  let attempt = 0;
  let lastErr;
  while (attempt < maxRetries) {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      console.log('OpenAI API raw response:', response.data);
      return response.data.choices?.[0]?.message?.content || '';
    } catch (err) {
      lastErr = err;
      // If we have an axios response, attach status and body to error.message for clearer logs
      if (err && err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;
        const body = err.response.data;
        const extra = `HTTP ${status} ${statusText} - ${JSON.stringify(body)}`;
        // Preserve original error but include remote response for diagnostics
        const newErr = new Error(`${err.message} | ${extra}`);
        newErr.original = err;
        lastErr = newErr;
      }

      if (err.response && err.response.status === 429) {
        const delay = Math.pow(2, attempt) * 500 + Math.random() * 500;
        await new Promise(res => setTimeout(res, delay));
        attempt++;
      } else {
        throw lastErr || err;
      }
    }
  }
  throw lastErr || new Error('Failed to get response from OpenAI');
}

// Embedding stub (OpenAI embedding API could be added later if needed)
async function getEmbedding(text) {
  throw new Error('Embedding not supported with current API');
}

module.exports = { getGeminiResponse, getEmbedding };
