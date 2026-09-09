import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const topLeaf = result.leaf_details;
  const confidence = result.confidence;
  const isReliable = result.is_reliable;

  // Ensure class name is cleanly formatted without underscores
  const formatClassName = (name) => {
    if (!name) return '';
    return name.replace(/_/g, ' ');
  };

  const displayTitle = formatClassName(
    result.predicted_class || topLeaf?.class_name || topLeaf?.name
  );

  return (
    <div className="results-card glass-card">
      <div className="result-header">
        <div>
          <div className="badge category-tag" style={{ marginBottom: '0.5rem' }}>
            <Leaf size={12} />
            <span>{topLeaf?.category || "Medicinal Plant"}</span>
          </div>
          <h2 className="result-main-title">
            {displayTitle}
          </h2>
          <p className="result-botanical">
            {topLeaf?.botanical_name || "Botanical details available"}
          </p>
        </div>

        <div className="confidence-badge">
          <span className="confidence-num">{confidence}%</span>
          <span className="confidence-label">Confidence</span>
        </div>
      </div>

      {!isReliable && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          fontSize: '0.85rem'
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>Low confidence detection. Please ensure the leaf is well-lit, in-focus, and clearly visible against a plain background.</span>
        </div>
      )}

      {topLeaf && (
        <div className="result-summary-box">
          <p className="result-summary-text">
            {topLeaf.medicinal_uses}
          </p>
        </div>
      )}

      {/* Top 5 Predictions Breakdown */}
      <div className="top-k-section">
        <h4 className="top-k-title">Top-5 Model Predictions</h4>
        {result.top_k && result.top_k.map((item, idx) => (
          <div key={item.class_name} className="prediction-bar-item">
            <div className="prediction-bar-meta">
              <span style={{ color: idx === 0 ? '#fff' : 'var(--text-secondary)' }}>
                {idx + 1}. {formatClassName(item.class_name || item.leaf_details?.class_name || item.leaf_details?.name)}
              </span>
              <span style={{ fontWeight: 600, color: idx === 0 ? '#34d399' : 'var(--text-dim)' }}>
                {item.confidence}%
              </span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill ${idx > 0 ? 'secondary' : ''}`}
                style={{ width: `${Math.max(item.confidence, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="result-actions">
        {topLeaf?.id && (
          <Link to={`/leaf/${topLeaf.id}`} state={{ from: 'classifier' }} className="btn btn-primary" style={{ flex: 1 }}>
            <span>Explore Full Leaf Details</span>
            <ArrowRight size={18} />
          </Link>
        )}
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Test Another
        </button>
      </div>
    </div>
  );
}
