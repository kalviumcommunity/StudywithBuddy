import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div className="page-container">
    <h2>StudyBuddy </h2>
    <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
      Welcome to your AI-powered study assistant! Choose a feature to get started.
    </p>
    <div className="dashboard-links">
      <Link to="/doubt" className="dashboard-link">
        🤔 Doubt-solving
      </Link>
      <Link to="/pdf" className="dashboard-link">
        📄 PDF Upload & Q&A
      </Link>
      <Link to="/flashcards" className="dashboard-link">
        🗂️ Flashcard Generator
      </Link>
      <Link to="/quiz" className="dashboard-link">
        🧪 Quiz Generator
      </Link>
      <Link to="/studyplan" className="dashboard-link">
        📅 Study Planner
      </Link>
    </div>
  </div>
);

export default Dashboard;