# AyurLeaf AI — Indian Medicinal Leaf Classification & Herb Encyclopedia

A full-stack AI web application for identifying 80 species of Indian medicinal plants from leaf photographs using a MobileNetV2 deep learning model, integrated with traditional Ayurvedic botanical profiles.

---

## Architecture Overview

```
Medicinal Leaf Classification/
├── saved_models/                  # Model versions directory
│   └── model_1.keras              # Native modern Keras model (version 1)
├── Training.ipynb                 # Jupyter notebook used to train MobileNetV2
├── backend/                       # Python backend managed with uv
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI endpoints & static SPA server
│   │   ├── model.py               # Keras inference engine loading .keras model
│   │   ├── database.py            # Botanical knowledge base query manager
│   │   └── data/
│   │       └── leaves.json        # Detailed profiles for all 80 plant species
│   ├── pyproject.toml             # uv configuration
│   ├── requirements.txt           # Python dependencies
│   └── run.py                     # Backend server launcher (port 8000)
├── frontend/                      # React frontend built with Vite & Vanilla CSS
│   ├── public/
│   │   └── samples/               # Pre-bundled sample leaves (Tulsi, Neem, Mint, etc.)
│   ├── src/
│   │   ├── components/            # Navbar, ImageUploader, PredictionResult, LeafCard, etc.
│   │   ├── pages/                 # ClassifierPage, LeafDetailPage, EncyclopediaPage, AboutPage
│   │   ├── styles/                # Botanical Green CSS & design tokens
│   │   ├── App.jsx                # Multi-page React Router
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js             # Vite config with API proxy to port 8000
```

---

## Quick Start

### 1. Backend Setup & Run (with `uv`)

```bash
# Create virtual environment with Python 3.12 (if not already created)
uv venv .venv --python 3.12

# Install dependencies using uv
uv pip install -r backend/requirements.txt --python .venv/Scripts/python.exe

# Run backend server
.venv\Scripts\python.exe backend/run.py
```
The backend starts at `http://127.0.0.1:8000`.

### 2. Frontend Setup & Run (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
The React development server runs at `http://localhost:5173`.

---

## 🚀 Deployment Guide

### A. Deploy Frontend on Vercel (1-Click)

1. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
2. Select your GitHub repository: `yogeshwaran-cse/medicinal-leaf-classification`.
3. Vercel automatically detects the root [vercel.json](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/vercel.json):
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
4. *(Optional)* Add Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://ayurleaf-api.onrender.com`).
5. Click **Deploy**. Your app will be live with full SPA routing!
   *(Note: The 80-plant botanical encyclopedia and leaf details work 100% instantly on Vercel via static bundling, even before the backend is deployed!)*

### B. Deploy Backend (FastAPI + TensorFlow) on Render / Railway / Docker

Because TensorFlow exceeds Vercel Serverless Function limits (>250MB), the backend is deployed to a container or web service:

**Option 1: Render.com (Free Web Service)**
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
2. Connect your repository.
3. Settings:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Copy your Render URL (e.g., `https://ayurleaf-api.onrender.com`) and paste it into your Vercel project's `VITE_API_BASE_URL` environment variable!

**Option 2: Docker / Hugging Face Spaces / Railway**
Use the included [Dockerfile](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/Dockerfile) for automated container builds.

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
