import React, { useState } from 'react';

const Doubt = () => {
  const [subject, setSubject] = useState('Physics');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('http://localhost:5001/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, question })
      });
      const data = await res.json();
      if (res.ok) setAnswer(data.answer);
      else setError(data.message || 'Error getting answer');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>🤔 Ask Your Doubt</h2>
      <form onSubmit={handleSubmit}>
        <select value={subject} onChange={e => setSubject(e.target.value)}>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Math</option>
          <option>Biology</option>
        </select>
        <textarea 
          placeholder="Type your question here..." 
          value={question} 
          onChange={e => setQuestion(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Asking...' : 'Ask Question'}
        </button>
      </form>
      {answer && <div className="answer"><strong>Answer:</strong> {answer}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Doubt;