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

1. **Mobile-First Responsive Design with Web Desktop Parity:**
   - Tailored palette (Forest, Emerald, Sage, Mint, Glassmorphism).
   - Dual-mode navigation: desktop horizontal top bar and mobile slide-out drawer plus fixed native app bottom navigation bar.
   - Fluid typography, touch-friendly 44px+ tap targets, and safe-area inset support for modern smartphones (iPhone and Android).

2. **Leaf Classification:**
   - Drag-and-drop file picker for high-resolution images.
   - Direct smartphone camera capture with autofocus and macro sensor support (`capture="environment"`), plus live webcam stream for desktop.
   - Quick one-click test sample gallery (Tulsi, Neem, Betel, Doddpathre).
   - Real-time prediction displaying Top-1 class, confidence score, and Top-5 breakdown meters with smooth mobile auto-scroll.

3. **Dedicated Leaf Details Page (`/leaf/:id`):**
   - Scientific botanical classification and plant family.
   - Indian regional names in 5+ languages (Hindi, Sanskrit, Tamil, Kannada, Telugu).
   - Comprehensive therapeutic benefits.
   - Traditional Ayurvedic home remedies and preparation methods (Kashayam decoctions, pastes, herbal teas, infused oils).
   - Parts used and safety/dosage guidelines.

4. **80-Plant Encyclopedia (`/directory`):**
   - Search by common, scientific, or regional names (with 16px minimum font size to prevent mobile auto-zoom).
   - Horizontal swipeable health category filters (Immunity & Fever, Digestion & Gut, Skin & Hair, Respiratory & Cold, Diabetes & Heart, General Wellness).

5. **Client-Side TensorFlow.js WebGL Inference:**
   - 100% private, serverless client-side AI inference running directly in the browser via WebGL.
   - Sub-100ms classification with zero cloud latency and no external Python servers required.

---

## Dataset & Attribution

This project is trained on the authentic **[Indian Medicinal Leaves Dataset](https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset)** created and shared by **Arya Shah** on Kaggle.

- **Dataset URL:** [https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset](https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset)
- **Dataset Creator:** [Arya Shah](https://www.kaggle.com/aryashah2k)
- **Scope & Highlights:** Thousands of botanical leaf images covering 80 distinct medicinal plant species commonly used across Indian Ayurvedic, Siddha, and traditional herbal medicine systems.
- **Model Training:** MobileNetV2 transfer learning architecture fine-tuned with 224&times;224 RGB input resolution, reaching high multi-class accuracy across all 80 species.

