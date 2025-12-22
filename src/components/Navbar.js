import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="xp-navbar">

      {/* Logo */}
      <div className="xp-logo glow">
        Vistar Netra
      </div>

      {/* Center Sliding Links */}
      <ul className="xp-links auto-slide">

        {/* --- Existing Links (Untouched) --- */}
        <li className="xp-item"><Link to="/">✨ Homepage</Link></li>
        <li className="xp-item"><Link to="/space">🏫 Campus Vistara</Link></li>
        <li className="xp-item"><Link to="/surveillance">👁️ College Netra</Link></li>
        <li className="xp-item"><Link to="/CircuAIApp">🧠 Student Mitra</Link></li>
        <li className="xp-item"><Link to="/TimetableFrontend">📅 Timetable Generator</Link></li>
        <li className="xp-item"><Link to="/notifications">📜 Docu AI</Link></li>
        <li className="xp-item"><Link to="/AIApp">⚡ Circu AI</Link></li>
        <li className="xp-item"><Link to="/ParentConnect">💫 Parent-Connect</Link></li>
        <li className="xp-item"><Link to="/settings">📡 Digi Notice</Link></li>

        {/* --- NEW AI MODULES (SAFE ADDITION) --- */}
        <li className="xp-item"><Link to="/FacultyAnalysisModal">👨‍🏫 Faculty Load Intelligence</Link></li>
        <li className="xp-item"><Link to="/FacultyAnalysisModal">📊 Attendance Insight Engine</Link></li>
        <li className="xp-item"><Link to="/course-recommendation">🎯 AI Course Recommendation</Link></li>
        <li className="xp-item"><Link to="/invigilation-allocator">🛡 Smart Invigilation Allocator</Link></li>
        <li className="xp-item"><Link to="/feedback-intelligence">📝 Feedback Intelligence</Link></li>

      </ul>

    </nav>
  );
};

export default Navbar;




