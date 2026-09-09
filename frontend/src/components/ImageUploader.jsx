import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUploader({ onImageSelected, previewUrl, onClearPreview, isAnalyzing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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

  // Camera handling
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please allow camera permissions or upload an image file instead.");
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
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
              disabled={isAnalyzing}
            >
              <X size={18} />
            </button>
          </div>
          {isAnalyzing && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(6, 24, 17, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: '#34d399'
            }}>
              <Loader2 size={42} className="spin-animation" style={{ animation: 'spin 1.2s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#fff' }}>
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="dropzone-icon">
            <Upload size={30} />
          </div>

          <h3 className="dropzone-title">Upload or Drop Leaf Photo</h3>
          <p className="dropzone-hint">Supports high-res JPG, PNG, or WEBP leaf images</p>

          <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <ImageIcon size={18} />
              <span>Browse File</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={openCamera}
            >
              <Camera size={18} />
              <span>Use Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Camera Snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Webcam Modal */}
      {isCameraOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Capture Leaf Photo</h3>
              <button className="btn-icon-sm" onClick={closeCamera}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-video-wrapper">
              <video ref={videoRef} autoPlay playsInline className="modal-video" />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={closeCamera}>Cancel</button>
              <button className="btn btn-primary" onClick={capturePhoto}>
                <Camera size={18} />
                <span>Snap Picture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
