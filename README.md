# AyurLeaf AI — Indian Medicinal Leaf Classification & Herb Encyclopedia

A full-stack AI web application for identifying 80 species of Indian medicinal plants from leaf photographs using a MobileNetV2 deep learning model, integrated with traditional Ayurvedic botanical profiles.

---

## Architecture Overview

```
Medicinal Leaf Classification/
├── saved_models/                  # Trained model directory
│   └── model_1.keras              # MobileNetV2 Keras model
├── convert_model_to_tfjs.py       # Converter script from .keras to TensorFlow.js graph model
├── Training.ipynb                 # Jupyter notebook used to train MobileNetV2
├── vercel.json                    # Vercel deployment configuration
├── frontend/                      # React frontend built with Vite & Vanilla CSS
│   ├── public/
│   │   ├── model/                 # TensorFlow.js WebGL graph model & weight shards
│   │   └── samples/               # Authentic test sample leaves (Tulsi, Neem, Betel, Doddpathre)
│   ├── src/
│   │   ├── components/            # Navbar, ImageUploader, PredictionResult, LeafCard, Footer
│   │   ├── pages/                 # ClassifierPage, LeafDetailPage, EncyclopediaPage, AboutPage
│   │   ├── services/              # Client-side TensorFlow.js WebGL classifier engine
│   │   ├── data/                  # 80-species Ayurvedic knowledge base (leaves.json)
│   │   ├── styles/                # Botanical Green CSS & design tokens
│   │   ├── App.jsx                # Multi-page React Router
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js             # Vite configuration
```

---

## Quick Start

### Frontend Setup & Run (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
The React development server runs at `http://localhost:5173`.

---

## Features

1. **Minimalist Botanical Green Aesthetic:**
   - Tailored palette (Forest, Emerald, Sage, Mint, Glassmorphism).
   - Smooth animations, responsive layout, modern typography (*Plus Jakarta Sans* & *Outfit*).

2. **Leaf Classification:**
   - Drag-and-drop or file picker for high-resolution images.
   - Live camera snapshot feature using HTML5 MediaDevices.
   - Quick one-click test sample gallery (Tulsi, Neem, Aloe Vera, Mint).
   - Real-time prediction displaying Top-1 class, confidence score, and Top-5 breakdown meters.

3. **Dedicated Leaf Details Page (`/leaf/:id`):**
   - Scientific botanical classification and plant family.
   - Indian regional names in 5+ languages (Hindi, Sanskrit, Tamil, Kannada, Telugu).
   - Comprehensive therapeutic benefits.
   - Traditional Ayurvedic home remedies and preparation methods (Kashayam decoctions, pastes, herbal teas, infused oils).
   - Parts used and safety/dosage guidelines.

4. **80-Plant Encyclopedia (`/directory`):**
   - Search by common, scientific, or regional names.
   - Health category filters (Immunity & Fever, Digestion & Gut, Skin & Hair, Respiratory & Cold, Diabetes & Heart, General Wellness).

5. **Modern Keras Model (.keras):**
   - Directly loads the native `model_1.keras` format (Keras 3 / TensorFlow 2.16+ compatible).
   - Fast, self-contained single-file model without legacy deprecation warnings.
