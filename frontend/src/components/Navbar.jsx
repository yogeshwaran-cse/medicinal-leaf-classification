import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, BookOpen, Info, Sparkles } from 'lucide-react';
import { subscribeModelStatus } from '../services/leafClassifier';

export default function Navbar() {
  const [modelStatus, setModelStatus] = useState({ ready: false, loading: false, backend: null });

  useEffect(() => {
    const unsubscribe = subscribeModelStatus(status => {
      setModelStatus(status);
    });
    return unsubscribe;
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

        <div className="nav-status" title={modelStatus.ready ? `MobileNetV2 Model Active (${modelStatus.backend} - 80 classes)` : (modelStatus.loading ? "Loading AI weights into WebGL..." : "AI Active (80 Species)")}>
          <div className="status-dot" style={{ background: modelStatus.ready ? '#10b981' : (modelStatus.loading ? '#f59e0b' : '#10b981') }} />
          <span>{modelStatus.ready ? `AI Ready (${modelStatus.backend?.toUpperCase() || 'WebGL'})` : (modelStatus.loading ? "Loading AI Model..." : "AI Active (80 Species)")}</span>
        </div>
      </div>
    </header>
  );
}
