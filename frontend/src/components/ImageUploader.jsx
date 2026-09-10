import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';

export default function ImageUploader({ onImageSelected, previewUrl, onClearPreview, isAnalyzing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  };

  // Start video stream with specified camera facing mode
  const startStream = async (mode = 'environment') => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    let stream = null;
    try {
      // Prefer rear camera on smartphones (macro lens & autofocus)
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    } catch (err) {
      console.warn(`Camera mode ${mode} failed, falling back to any video device:`, err);
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      try {
        await videoRef.current.play();
      } catch (playErr) {
        console.log("Video play handled:", playErr);
      }
    }
  };

  // Open camera modal (works on both mobile and desktop)
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      await startStream(facingMode);
    } catch (err) {
      console.error("Camera access error:", err);
      setIsCameraOpen(false);
      alert("Unable to access camera: " + (err.message || "Please check browser camera permissions."));
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  // Switch between rear and front cameras (especially useful on phones)
  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    try {
      await startStream(nextMode);
    } catch (err) {
      console.warn("Failed to switch camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-leaf-capture.jpg', { type: 'image/jpeg' });
          closeCamera();
          onImageSelected(file);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="upload-panel">
      {previewUrl ? (
        <div className="preview-container glass-card">
          <img src={previewUrl} alt="Leaf Preview" className="preview-img" />
          <div className="preview-overlay">
            <button
              className="btn-icon-sm"
              onClick={onClearPreview}
              title="Remove image and test another"
              aria-label="Remove image"
              disabled={isAnalyzing}
            >
              <X size={18} />
            </button>
          </div>
          {isAnalyzing && (
            <div className="analyzing-overlay">
              <Loader2 size={44} className="spin-animation" />
              <span className="analyzing-text">
                Analyzing Leaf Features with AI...
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`dropzone ${isDragOver ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {/* File Picker Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="dropzone-icon">
            <Upload size={28} />
          </div>

          <h3 className="dropzone-title">Upload or Snap Leaf Photo</h3>
          <p className="dropzone-hint">Clear, well-lit photo of single leaf or foliage</p>

          <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn btn-primary dropzone-btn"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <ImageIcon size={18} />
              <span>Browse Photos</span>
            </button>

            <button
              type="button"
              className="btn btn-outline dropzone-btn"
              onClick={openCamera}
            >
              <Camera size={18} />
              <span>Snap with Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Camera Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Live Camera Viewfinder Modal (Mobile & Desktop) */}
      {isCameraOpen && (
        <div className="modal-backdrop" onClick={closeCamera}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>Live Leaf Camera</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-icon-sm"
                  onClick={toggleFacingMode}
                  title="Switch camera (Rear / Front)"
                  aria-label="Switch camera"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  type="button"
                  className="btn-icon-sm"
                  onClick={closeCamera}
                  aria-label="Close camera"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="modal-video-wrapper">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="modal-video"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={closeCamera}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                <Camera size={18} />
                <span>Capture Leaf</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
