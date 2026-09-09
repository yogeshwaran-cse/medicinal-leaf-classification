import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

export default function LeafCard({ leaf }) {
  return (
    <div className="catalog-card glass-card">
      <div className="catalog-card-header">
        <div className="badge" style={{ alignSelf: 'flex-start', fontSize: '0.72rem' }}>
          <Leaf size={10} />
          <span>{leaf.category || "Herbal"}</span>
        </div>

        {/* Dataset Folder Name */}
        <h3 className="catalog-leaf-name">
          {leaf.class_name ? leaf.class_name.replace(/_/g, ' ') : leaf.name}
        </h3>

        {/* Scientific / Botanical Name */}
        <div className="catalog-scientific-row">
          <span className="catalog-botanical-label">Scientific:</span>
          <span className="catalog-botanical">{leaf.botanical_name}</span>
        </div>
      </div>

      <p className="catalog-benefits-preview">
        {leaf.benefits && leaf.benefits.length > 0
          ? leaf.benefits.slice(0, 2).join(" • ")
          : leaf.medicinal_uses}
      </p>

      <div className="catalog-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Family: {leaf.family}
        </span>
        <Link to={`/leaf/${leaf.id}`} state={{ from: 'encyclopedia' }} className="catalog-link">
          <span>Read Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
