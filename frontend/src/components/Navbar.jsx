import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, BookOpen, Info, Sparkles } from 'lucide-react';
import { getApiUrl } from '../api/config';

export default function Navbar() {
  const [modelOnline, setModelOnline] = useState(false);

  useEffect(() => {
    fetch(getApiUrl('/api/health'))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') setModelOnline(true);
      })
      .catch(() => setModelOnline(false));
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <NavLink to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Leaf size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Ayur<span>Leaf</span> AI</span>
            <span className="brand-tagline">Indian Medicinal Plants</span>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>Classifier</span>
          </NavLink>
          <NavLink to="/directory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={16} />
            <span>Encyclopedia (80)</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Info size={16} />
            <span>About</span>
          </NavLink>
        </nav>

        <div className="nav-status" title={modelOnline ? "MobileNetV2 Model Active (80 classes)" : "Connecting to API..."}>
          <div className="status-dot" style={{ background: modelOnline ? '#10b981' : '#f59e0b' }} />
          <span>{modelOnline ? "AI Active (80 Species)" : "Connecting..."}</span>
        </div>
      </div>
    </header>
  );
}
