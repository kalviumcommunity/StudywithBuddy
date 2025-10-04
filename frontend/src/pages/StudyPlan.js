import React, { useState } from 'react';

const StudyPlan = () => {
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState(7);
  const [selectedClass, setSelectedClass] = useState('7');
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlan([]);
    try {
      const res = await fetch('http://localhost:5001/api/ai/studyplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, days, class: selectedClass })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.plan)) setPlan(data.plan);
      else setError(data.message || 'Error generating plan');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>📅 Study Planner</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Subject (e.g., Physics, Chemistry)" 
          value={subject} 
          onChange={e => setSubject(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          min={1} 
          max={60} 
          placeholder="Number of days" 
          value={days} 
          onChange={e => setDays(Number(e.target.value))} 
          required 
        />
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{margin: '10px 0', padding: '6px', borderRadius: '6px', border: '1px solid #ccc'}}>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Study Plan'}
        </button>
      </form>
      {plan.length > 0 && (
        <div style={{marginTop: '20px'}}>
          <h3>📚 Your {days}-Day Study Plan</h3>
          <ul>
            {plan.map((day, i) => (
              <li key={i} className="quiz-question">
                <div style={{marginBottom: '10px'}}>
                  <strong>Day {day.day}:</strong>
                </div>
                <div style={{marginBottom: '8px'}}>
                  <strong>Topics:</strong> {day.topics && day.topics.join(', ')}
                </div>
                <div>
                  <strong>Tasks:</strong> {day.tasks && day.tasks.join(', ')}
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

export default StudyPlan;