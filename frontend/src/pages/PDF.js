import React, { useState } from 'react';

const PDF = () => {
  const [file, setFile] = useState(null);
  const [docId, setDocId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setDocId('');
    setAnswer('');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) setDocId(data.docId);
      else setError(data.message || 'Upload failed');
    } catch (err) {
      setError('Network error');
    }
    setUploading(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!docId || !question) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/pdf/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, question })
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
      <h2>📄 PDF Upload & Q&A</h2>
      <form onSubmit={handleUpload}>
        <div className="file-upload">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={e => setFile(e.target.files[0])} 
            required 
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
      {docId && <div className="success">✅ PDF uploaded successfully! You can now ask questions from your notes.</div>}
      {docId && (
        <form onSubmit={handleAsk} style={{marginTop: '20px'}}>
          <textarea 
            placeholder="Ask a question from your uploaded notes..." 
            value={question} 
            onChange={e => setQuestion(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Asking...' : 'Ask Question'}
          </button>
        </form>
      )}
      {answer && <div className="answer"><strong>Answer:</strong> {answer}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default PDF;