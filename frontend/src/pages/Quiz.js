import React, { useState } from 'react';

const Quiz = () => {
  const [input, setInput] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuiz([]);
    try {
      const res = await fetch('http://localhost:5001/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.quiz)) setQuiz(data.quiz);
      else setError(data.message || 'Error generating quiz');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>🧪 Quiz Generator</h2>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="Enter a topic or paste your notes here..." 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>
      {quiz.length > 0 && (
        <div style={{marginTop: '20px'}}>
          <h3>📝 Your Quiz</h3>
          <ul>
            {quiz.map((q, i) => (
              <li key={i} className="quiz-question">
                <div style={{marginBottom: '15px'}}>
                  <strong>Q{i+1}:</strong> {q.question}
                </div>
                <div className="quiz-options">
                  {q.options && q.options.map((opt, j) => (
                    <div key={j} style={{margin: '5px 0'}}>
                      {String.fromCharCode(65+j)}. {opt}
                    </div>
                  ))}
                </div>
                <div className="quiz-answer">
                  <strong>Answer:</strong> {q.answer}
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

export default Quiz;