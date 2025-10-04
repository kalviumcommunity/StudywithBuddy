import React, { useState } from 'react';

const Flashcards = () => {
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlashcards([]);
    try {
      const res = await fetch('http://localhost:5001/api/ai/flashcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, count })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.flashcards)) setFlashcards(data.flashcards);
      else setError(data.message || 'Error generating flashcards');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>🗂️ Flashcard Generator</h2>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="Enter a topic or paste your notes here..." 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          required 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <label htmlFor="flashcard-count" style={{ fontWeight: 600 }}>Number of Flashcards:</label>
          <input
            id="flashcard-count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </form>
      {flashcards.length > 0 && (
        <div style={{marginTop: '20px'}}>
          <h3>📚 Your Flashcards</h3>
          <ul>
            {flashcards.map((fc, i) => (
              <li key={i} className="quiz-question">
                <div className="flashcard-question" style={{marginBottom: '10px'}}>
                  <strong>Q{i+1}:</strong> {fc.question}
                </div>
                <div className="flashcard-answer">
                  <strong>A:</strong> {fc.answer}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Flashcards;