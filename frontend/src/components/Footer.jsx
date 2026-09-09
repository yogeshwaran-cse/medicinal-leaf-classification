import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
                <Leaf size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
                AyurLeaf AI
              </span>
            </div>
            <p style={{ maxWidth: '380px', lineHeight: 1.6, color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              Deep Learning MobileNetV2 architecture trained to accurately recognize 80 species of Indian medicinal plants and connect people with traditional Ayurvedic knowledge.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.85rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-dim)' }}>Leaf Classifier</Link></li>
              <li><Link to="/directory" style={{ color: 'var(--text-dim)' }}>80-Herb Encyclopedia</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-dim)' }}>AI Architecture & Lore</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.85rem' }}>Herbal Safety</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              Information provided is for educational and identification purposes. Consult certified Ayurvedic doctors or medical practitioners before beginning medicinal herbal remedies.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} AyurLeaf AI &bull; Indian Medicinal Flora Classification</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Preserving Ayurvedic Wisdom with Deep Learning
          </span>
        </div>
      </div>
    </footer>
  );
}
