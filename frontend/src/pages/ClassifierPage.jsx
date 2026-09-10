import React, { useState, useEffect, useRef } from 'react';
import ImageUploader from '../components/ImageUploader';
import SampleGallery from '../components/SampleGallery';
import PredictionResult from '../components/PredictionResult';
import { Sparkles, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { classifyImage, initClassifier } from '../services/leafClassifier';

export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const resultsRef = useRef(null);

  // Preload model on initial mount for zero-wait subsequent predictions
  useEffect(() => {
    initClassifier().catch(err => {
      console.warn("Background model preload notice:", err);
    });
  }, []);

  // Smooth scroll down to results on mobile/tablet screens when prediction arrives
  useEffect(() => {
    if (prediction && resultsRef.current && window.innerWidth <= 960) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [prediction]);

  const handleImageSelected = async (file, customPreviewUrl = null) => {
    const preview = customPreviewUrl || URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(preview);
    setPrediction(null);
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // Direct client-side inference using TensorFlow.js WebGL
      const result = await classifyImage(customPreviewUrl || file);
      setPrediction(result);
    } catch (err) {
      console.error("Classification error:", err);
      setErrorMsg(`Failed to classify image locally: ${err.message || 'Check browser console for details'}`);
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
    <main className="container main-content-wrapper">
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
        <div className="classifier-upload-col">
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
            <div className="error-banner">
              {errorMsg}
            </div>
          )}
        </div>

        {prediction && (
          <div ref={resultsRef} className="classifier-result-col">
            <PredictionResult
              result={prediction}
              onReset={handleClear}
            />
          </div>
        )}
      </section>

      {/* Feature Highlights */}
      {!prediction && (
        <section className="features-highlights-grid">
          <div className="glass-card feature-highlight-card">
            <div className="dropzone-icon feature-icon">
              <Zap size={22} />
            </div>
            <h3 className="feature-card-title">MobileNetV2 Vision</h3>
            <p className="feature-card-desc">
              Fine-tuned deep convolutional neural network trained on thousands of authentic Indian medicinal leaf specimens.
            </p>
          </div>

          <div className="glass-card feature-highlight-card">
            <div className="dropzone-icon feature-icon">
              <BookOpen size={22} />
            </div>
            <h3 className="feature-card-title">80 Medicinal Species</h3>
            <p className="feature-card-desc">
              Comprehensive Ayurvedic encyclopedia covering Tulsi, Neem, Giloy, Ashoka, Brahmi, Doddpathre, and 74 more.
            </p>
          </div>

          <div className="glass-card feature-highlight-card">
            <div className="dropzone-icon feature-icon">
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-card-title">Remedies & Preparations</h3>
            <p className="feature-card-desc">
              Step-by-step preparation guides (Kashayam, herbal oils, leaf pastes, teas) with dosage guidelines and contraindications.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
