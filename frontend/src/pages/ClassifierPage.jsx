import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import SampleGallery from '../components/SampleGallery';
import PredictionResult from '../components/PredictionResult';
import { Sparkles, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { getApiUrl } from '../api/config';

export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleImageSelected = async (file, customPreviewUrl = null) => {
    setSelectedFile(file);
    setPreviewUrl(customPreviewUrl || URL.createObjectURL(file));
    setPrediction(null);
    setErrorMsg(null);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(getApiUrl('/api/predict'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Classification error:", err);
      setErrorMsg("Failed to classify image. Ensure the backend server is running and reachable (verify VITE_API_BASE_URL if deployed).");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setErrorMsg(null);
  };

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge hero-pill">
          <Sparkles size={14} style={{ color: '#34d399' }} />
          <span>AI-Powered Botanical Intelligence</span>
        </div>
        <h1 className="hero-title">
          Identify Any <span className="gradient-text">Indian Medicinal Leaf</span> Instantly
        </h1>
        <p className="hero-description">
          Snap or upload a leaf photograph to classify across 80 medicinal plant species. Discover traditional Ayurvedic uses, home remedies, scientific classifications, and preparation tips.
        </p>
      </section>

      {/* Main Classifier Area */}
      <section className={`classifier-grid ${prediction ? 'has-result' : ''}`}>
        <div>
          <ImageUploader
            onImageSelected={handleImageSelected}
            previewUrl={previewUrl}
            onClearPreview={handleClear}
            isAnalyzing={isAnalyzing}
          />

          {!previewUrl && (
            <SampleGallery
              onSelectSample={handleImageSelected}
              isAnalyzing={isAnalyzing}
            />
          )}

          {errorMsg && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.9rem'
            }}>
              {errorMsg}
            </div>
          )}
        </div>

        {prediction && (
          <PredictionResult
            result={prediction}
            onReset={handleClear}
          />
        )}
      </section>

      {/* Feature Highlights */}
      {!prediction && (
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          margin: '2rem 0 4rem'
        }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div className="dropzone-icon" style={{ width: '48px', height: '48px', margin: '0 0 1rem 0' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>MobileNetV2 Vision</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Fine-tuned deep convolutional neural network trained on thousands of authentic Indian medicinal leaf specimens.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div className="dropzone-icon" style={{ width: '48px', height: '48px', margin: '0 0 1rem 0' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>80 Medicinal Species</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Comprehensive Ayurvedic encyclopedia covering Tulsi, Neem, Giloy, Ashoka, Brahmi, Doddapathre, and 74 more.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div className="dropzone-icon" style={{ width: '48px', height: '48px', margin: '0 0 1rem 0' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Remedies & Remedies</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Step-by-step preparation guides (Kashayam, herbal oils, leaf pastes, teas) with dosage guidelines and contraindications.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
