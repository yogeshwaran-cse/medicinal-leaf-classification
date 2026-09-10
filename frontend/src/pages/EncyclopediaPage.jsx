import React, { useState } from 'react';
import { Search, X, BookOpen, Filter } from 'lucide-react';
import LeafCard from '../components/LeafCard';
import staticLeavesRaw from '../data/leaves.json';

const staticLeaves = staticLeavesRaw.map(leaf => ({
  id: leaf.id || leaf.class_name.toLowerCase().replace(/ /g, '_'),
  ...leaf
}));

const staticCategories = ["All", ...Array.from(new Set(staticLeaves.map(l => l.category).filter(Boolean)))];

export default function EncyclopediaPage() {
  const [leaves] = useState(staticLeaves);
  const [categories] = useState(staticCategories);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const loading = false;

  // Filter leaves based on search and category
  const filteredLeaves = leaves.filter(leaf => {
    const matchesCategory = selectedCategory === "All" || leaf.category === selectedCategory;
    
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const names = [
      leaf.name,
      leaf.class_name,
      leaf.botanical_name,
      leaf.family,
      ...(leaf.benefits || []),
      ...(Object.values(leaf.regional_names || {}))
    ].filter(Boolean).map(s => s.toLowerCase());

    return names.some(n => n.includes(q));
  });

  return (
    <div className="container directory-page">
      <div className="directory-header">
        <div className="badge hero-pill">
          <BookOpen size={14} style={{ color: '#34d399' }} />
          <span>Complete Herbal Database</span>
        </div>
        <h1 className="directory-title">
          Indian Medicinal Plants <span className="gradient-text">Encyclopedia</span>
        </h1>
        <p className="hero-description">
          Explore all 80 verified botanical species alongside their scientific and botanical nomenclature, health benefits, and traditional Ayurvedic remedies.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by leaf name (e.g. Astma_weed, Doddpathre, Citron lime), scientific name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        color: 'var(--text-dim)',
        fontSize: '0.9rem'
      }}>
        <span>
          Showing <strong>{filteredLeaves.length}</strong> of {leaves.length} medicinal species
        </span>
        {selectedCategory !== "All" && (
          <span className="badge">
            Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Grid of Leaf Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="status-dot" style={{ width: '14px', height: '14px', margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-dim)' }}>Loading Encyclopedia Data...</p>
        </div>
      ) : filteredLeaves.length > 0 ? (
        <div className="leaf-catalog-grid">
          {filteredLeaves.map((leaf) => (
            <LeafCard key={leaf.id || leaf.class_name} leaf={leaf} />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={42} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Medicinal Leaves Found</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
            No herbs matched your search query "{searchQuery}".
          </p>
          <button
            className="btn btn-outline"
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
