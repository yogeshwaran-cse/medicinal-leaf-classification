import React from 'react';
import { Cpu, Database, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container about-page">
      <div className="directory-header">
        <div className="badge hero-pill">
          <Award size={14} style={{ color: '#34d399' }} />
          <span>Project Documentation</span>
        </div>
        <h1 className="directory-title">
          About <span className="gradient-text">AyurLeaf AI</span>
        </h1>
        <p className="hero-description">
          Bridging millennia-old Indian botanical knowledge with cutting-edge Deep Learning computer vision to identify, preserve, and understand our natural medicinal heritage.
        </p>
      </div>

      {/* Stats Counter */}
      <div className="stats-grid">
        <div className="stat-box glass-card">
          <div className="stat-number">80</div>
          <div className="stat-label">Medicinal Plant Species</div>
        </div>
        <div className="stat-box glass-card">
          <div className="stat-number">MobileNetV2</div>
          <div className="stat-label">Core Neural Architecture</div>
        </div>
        <div className="stat-box glass-card">
          <div className="stat-number">224×224</div>
          <div className="stat-label">Input Resolution</div>
        </div>
        <div className="stat-box glass-card">
          <div className="stat-number">5+</div>
          <div className="stat-label">Regional Indian Languages</div>
        </div>
      </div>

      {/* Model Architecture Card */}
      <div className="about-card glass-card">
        <h3 className="about-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Cpu size={24} style={{ color: '#34d399' }} />
          <span>Deep Learning Model & Training Pipeline</span>
        </h3>
        <p className="about-text">
          The core classification model is built upon <strong>MobileNetV2</strong> with transfer learning, fine-tuned on the Indian Medicinal Leaves Image Dataset. MobileNetV2 uses inverted residual blocks and depthwise separable convolutions to extract fine venation, shape margins, and textural patterns from leaf photos while maintaining high inference speed.
        </p>
        <p className="about-text">
          The preprocessing pipeline applies automated resizing to 224&times;224 pixels and [0, 1] rescaling, followed by global average pooling, dense layers with ReLU activation, and an 80-unit softmax classifier outputting probability distributions over all recognized species.
        </p>
      </div>

      {/* Model Format & Serving */}
      <div className="about-card glass-card">
        <h3 className="about-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Database size={24} style={{ color: '#34d399' }} />
          <span>Model Packaging: TensorFlow SavedModel (Folder 1)</span>
        </h3>
        <p className="about-text">
          The model is served directly from directory <code>1/</code> using TensorFlow's native <strong>SavedModel</strong> format. SavedModel bundles the computation graph, learned weights, and signature definitions into a unified format.
        </p>
        <p className="about-text">
          The backend runs on <strong>FastAPI</strong> and is managed via the modern <strong>uv</strong> package manager, leveraging <code>tf-keras</code> for inference and instant prediction response times.
        </p>
      </div>

      {/* Ayurvedic Knowledge Base */}
      <div className="about-card glass-card">
        <h3 className="about-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HeartHandshake size={24} style={{ color: '#34d399' }} />
          <span>Ayurvedic Wisdom & Botanical Cataloging</span>
        </h3>
        <p className="about-text">
          Each of the 80 species cataloged in AyurLeaf AI is cross-referenced with classical Ayurvedic treatises including the <em>Charaka Samhita</em>, <em>Sushruta Samhita</em>, and <em>Bhavaprakasha Nighantu</em>.
        </p>
        <p className="about-text">
          For every plant, users can view botanical classification, regional synonyms (Hindi, Sanskrit, Tamil, Kannada, Telugu), traditional preparations (Kashayam decoctions, taila medicated oils, leaf poultices), therapeutic benefits, and critical precautions.
        </p>
      </div>
    </div>
  );
}
