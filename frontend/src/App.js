import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doubt from './pages/Doubt';
import PDF from './pages/PDF';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import StudyPlan from './pages/StudyPlan';

const Navbar = () => (
  <nav className="navbar">
    <Link to="/">Dashboard</Link> | <Link to="/doubt">Doubt</Link> | <Link to="/pdf">PDF Q&A</Link> | <Link to="/flashcards">Flashcards</Link> | <Link to="/quiz">Quiz</Link> | <Link to="/studyplan">Study Planner</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doubt" element={<Doubt />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/studyplan" element={<StudyPlan />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
