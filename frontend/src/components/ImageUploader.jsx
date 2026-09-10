import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUploader({ onImageSelected, previewUrl, onClearPreview, isAnalyzing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

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
  const handleCameraClick = () => {
    // If mobile / touch device, prioritize high-res native camera app
    if (isTouchDevice() && nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
    } else {
      // Desktop / laptop webcam stream modal
      openWebcam();
    }
  };

  const openWebcam = async () => {
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
      // If webcam fails (e.g. desktop without webcam), fallback to file input
      alert("Unable to access live webcam. You can upload a leaf photograph instead.");
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
          {/* Standard File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Native Smartphone Camera Input (Opens native camera app with autofocus) */}
          <input
            type="file"
            ref={nativeCameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
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
              onClick={handleCameraClick}
            >
              <Camera size={18} />
              <span>Snap with Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Live Webcam Snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Live Webcam Stream Modal (for Desktop or WebCam) */}
      {isCameraOpen && (
        <div className="modal-backdrop" onClick={closeCamera}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>Live Leaf Camera</h3>
              <button className="btn-icon-sm" onClick={closeCamera} aria-label="Close camera">
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-video-wrapper">
              <video ref={videoRef} autoPlay playsInline muted className="modal-video" />
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
