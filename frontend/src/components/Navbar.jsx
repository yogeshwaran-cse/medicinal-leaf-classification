import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Leaf, BookOpen, Info, Sparkles, Menu, X, Cpu } from 'lucide-react';
import { subscribeModelStatus } from '../services/leafClassifier';

export default function Navbar() {
  const [modelStatus, setModelStatus] = useState({ ready: false, loading: false, backend: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeModelStatus(status => {
      setModelStatus(status);
    });
    return unsubscribe;
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const backendName = modelStatus.backend?.toUpperCase() || 'WebGL';

  return (
    <>
      <header className="navbar">
        <div className="container nav-container">
          {/* Brand Logo */}
          <NavLink to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="brand-icon-wrapper">
              <Leaf size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-title">Ayur<span>Leaf</span> AI</span>
              <span className="brand-tagline">Indian Medicinal Plants</span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-only">
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

          {/* Right Action Area */}
          <div className="nav-right-area">
            {/* AI Status Badge */}
            <div
              className="nav-status"
              title={
                modelStatus.ready
                  ? `MobileNetV2 Model Active (${backendName} - 80 classes)`
                  : modelStatus.loading
                  ? "Loading AI weights into WebGL..."
                  : "AI Active (80 Species)"
              }
            >
              <div
                className="status-dot"
                style={{ background: modelStatus.ready ? '#10b981' : (modelStatus.loading ? '#f59e0b' : '#10b981') }}
              />
              <span className="status-label">
                {modelStatus.ready
                  ? `AI Ready (${backendName})`
                  : modelStatus.loading
                  ? "Loading AI..."
                  : "AI Active (80)"}
              </span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px' }}>
                  <Leaf size={18} />
                </div>
                <div className="brand-text">
                  <span className="brand-title" style={{ fontSize: '1.15rem' }}>Ayur<span>Leaf</span> AI</span>
                  <span className="brand-tagline">Herbal Intelligence</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon-sm"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `mobile-drawer-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="mobile-item-icon">
                  <Sparkles size={20} />
                </div>
                <div className="mobile-item-text">
                  <span className="mobile-item-title">Leaf Classifier</span>
                  <span className="mobile-item-desc">Instant image recognition across 80 species</span>
                </div>
              </NavLink>

              <NavLink
                to="/directory"
                className={({ isActive }) => `mobile-drawer-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="mobile-item-icon">
                  <BookOpen size={20} />
                </div>
                <div className="mobile-item-text">
                  <span className="mobile-item-title">Herbal Encyclopedia</span>
                  <span className="mobile-item-desc">Explore 80 plants, benefits, and remedies</span>
                </div>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => `mobile-drawer-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="mobile-item-icon">
                  <Info size={20} />
                </div>
                <div className="mobile-item-text">
                  <span className="mobile-item-title">About & Architecture</span>
                  <span className="mobile-item-desc">MobileNetV2, WebGL, and Ayurvedic sources</span>
                </div>
              </NavLink>
            </nav>

            {/* Drawer Model Status Card */}
            <div className="mobile-drawer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Cpu size={16} style={{ color: '#34d399' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Local Inference Engine</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                TensorFlow.js running client-side with <strong>{backendName}</strong> hardware acceleration. 100% private, zero cloud latency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Fixed for quick thumb access) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={20} />
          <span>Classify</span>
        </NavLink>
        <NavLink
          to="/directory"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={20} />
          <span>80 Herbs</span>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <Info size={20} />
          <span>About</span>
        </NavLink>
      </nav>
    </>
  );
}
