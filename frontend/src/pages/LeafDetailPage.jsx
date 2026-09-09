import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Leaf, CheckCircle2, AlertCircle, Beaker, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export default function LeafDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [leaf, setLeaf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFromClassifier = location.state?.from === 'classifier';
  const backTarget = isFromClassifier ? '/' : '/directory';
  const backLabel = isFromClassifier ? 'Back to Leaf Classifier' : 'Back to Encyclopedia';

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    fetch(`/api/leaves/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Leaf not found");
        return res.json();
      })
      .then(data => {
        setLeaf(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="status-dot" style={{ width: '16px', height: '16px', margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ color: '#fff' }}>Loading Botanical Profile...</h2>
      </div>
    );
  }

  if (error || !leaf) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Botanical Profile Not Found</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          Could not locate leaf record for identifier: <strong>{id}</strong>
        </p>
        <Link to="/directory" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Browse All 80 Leaves</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container details-page">
      {/* Dynamic Contextual Back Navigation */}
      <Link to={backTarget} className="back-link">
        <ArrowLeft size={18} />
        <span>{backLabel}</span>
      </Link>

      {/* Main Botanical Hero Card */}
      <div className="details-hero glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className="badge details-hero-badge" style={{ marginBottom: 0 }}>
            <Leaf size={12} />
            <span>{leaf.category || "Medicinal Botanical"}</span>
          </div>
        </div>

        <h1 className="details-title">{leaf.class_name ? leaf.class_name.replace(/_/g, ' ') : leaf.name}</h1>
        
        <div className="details-botanical-row">
          <span className="details-botanical">Scientific: <em>{leaf.botanical_name}</em></span>
          <span className="details-family">Family: {leaf.family}</span>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '900px' }}>
          {leaf.medicinal_uses}
        </p>

        {/* Indian Regional Names */}
        {leaf.regional_names && (
          <div className="regional-section">
            <h4 className="regional-title">Indian Regional & Classical Names</h4>
            <div className="regional-grid">
              {Object.entries(leaf.regional_names).map(([lang, val]) => (
                <div key={lang} className="regional-card">
                  <span className="regional-lang">{lang}</span>
                  <p className="regional-name">{val || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Layout */}
      <div className="details-content-grid">
        {/* Left Column: Benefits & Preparations */}
        <div>
          {/* Key Health Benefits */}
          <div className="detail-card glass-card">
            <h3 className="detail-card-title">
              <Sparkles size={20} />
              <span>Primary Health & Therapeutic Benefits</span>
            </h3>

            <ul className="benefits-list">
              {leaf.benefits && leaf.benefits.map((benefit, i) => (
                <li key={i} className="benefit-item">
                  <div className="benefit-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Traditional Preparation & Remedies */}
          <div className="detail-card glass-card">
            <h3 className="detail-card-title">
              <Beaker size={20} />
              <span>Ayurvedic Preparations & Home Remedies</span>
            </h3>

            <div className="methods-list">
              {leaf.preparation_methods && leaf.preparation_methods.map((method, i) => (
                <div key={i} className="method-card">
                  <p className="method-text">{method}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Parts Used & Precautions */}
        <div>
          {/* Parts Used */}
          <div className="detail-card glass-card">
            <h3 className="detail-card-title" style={{ fontSize: '1.15rem' }}>
              <Leaf size={18} />
              <span>Medicinal Parts Used</span>
            </h3>

            <div className="parts-badges">
              {leaf.parts_used && leaf.parts_used.map((part, i) => (
                <span key={i} className="badge" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}>
                  {part}
                </span>
              ))}
            </div>
          </div>

          {/* Precautions & Dosage */}
          <div className="detail-card glass-card">
            <h3 className="detail-card-title" style={{ fontSize: '1.15rem' }}>
              <ShieldAlert size={18} style={{ color: '#fbbf24' }} />
              <span>Safety & Dosage Guidelines</span>
            </h3>

            <div className="precaution-box">
              <div className="precaution-header">
                <AlertCircle size={16} />
                <span>Important Precaution</span>
              </div>
              <p className="precaution-text">
                {leaf.precautions}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="detail-card glass-card" style={{ gap: '1rem' }}>
            <Link
              to={backTarget}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isFromClassifier ? <Sparkles size={18} /> : <BookOpen size={18} />}
              <span>{backLabel}</span>
            </Link>
            <Link
              to={isFromClassifier ? "/directory" : "/"}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              {isFromClassifier ? <BookOpen size={18} /> : <Sparkles size={18} />}
              <span>{isFromClassifier ? "Browse 80-Plant Encyclopedia" : "Try Leaf Classifier"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
