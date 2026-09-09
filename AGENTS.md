# AGENTS.md — Development History & Project Documentation

**Project Name:** AyurLeaf AI — Indian Medicinal Leaf Classification & Herb Encyclopedia  
**Workspace:** `c:\project folder\Medicinal Leaf Classification`  
**Generated Date:** September 9, 2026  

---

## 1. Executive Summary & Project Context

The goal of this project was to transform a deep learning research notebook (`Training.ipynb`) and trained MobileNetV2 model into an end-to-end, full-stack web application for classifying **80 species of Indian medicinal plants** with rich Ayurvedic and botanical knowledge.

---

## 2. Conversation & Iteration Timeline

### Phase 1: Initial Discovery & Architecture Analysis
- **User Prompt:** 
  > *"I am currently creating a website for classifiying Indian medicinal Leaf and i attached the nb: @[Training.ipynb] and saved the model in folder 1. Do: minimal Ui Design with Green color, takes image to classify the leaf, want all the leaf details in seperate page. Is it ok to use folder instead of other exe like .keras, if you want it suggest it. suggest any additional features if required."*
- **Findings from `Training.ipynb`:**
  - Architecture: MobileNetV2 (transfer learning) with input shape `(224, 224, 3)`.
  - Normalization: Internal `Resizing(224, 224)` and `Rescaling(1/255.0)` layers.
  - Number of Classes: Exactly 80 Indian medicinal plants.
  - Model format: TensorFlow SavedModel directory `1/` containing `saved_model.pb`, `variables/`, and `keras_metadata.pb`.
- **Model Format Analysis:**
  - In modern TensorFlow 2.16+ / Keras 3, legacy SavedModel folders trigger deserialization errors if loaded via standard `keras.models.load_model()`.
  - Using `tf-keras` with `compile=False` allowed loading folder `1` directly without re-training.
  - Recommended supporting both the SavedModel folder and single-file `.keras` / `.h5` formats.

---

### Phase 2: React JS, uv Package Manager & Directory Structure
- **User Prompt:**
  > *"use react js and js framework, use uv package manager and make it in proper directory structure"*
- **Actions Taken:**
  - Created a modular full-stack workspace structure:
    ```
    Medicinal Leaf Classification/
    ├── backend/       # FastAPI server managed via uv
    ├── frontend/      # React + Vite client application
    └── saved_models/  # Versioned model directory
    ```
  - Initialized Python virtual environment with `uv` (`.venv` with Python 3.12).
  - Installed dependencies via `uv`: `tensorflow`, `tf-keras`, `fastapi`, `uvicorn`, `pillow`, `python-multipart`.
  - Scaffolding of React frontend with Vite: `npx -y create-vite@latest frontend --template react --no-interactive`.
  - Installed `lucide-react` for botanical icons and `react-router-dom` for client-side routing.
  - Built comprehensive 80-plant botanical database (`backend/app/data/leaves.json` via `create_leaf_db.py`) covering:
    - Botanical / Scientific names and plant family
    - Indian regional names (Hindi, Sanskrit, Tamil, Kannada, Telugu)
    - Ayurvedic categories (Immunity, Digestion, Skin & Hair, Respiratory, Diabetes & Heart, General Wellness)
    - Health benefits, traditional preparation methods (Kashayam, leaf paste, herbal tea), parts used, and safety/dosage guidelines.

---

### Phase 3: Model Versioning & `saved_models` Organization
- **User Prompt:**
  > *"place folder 1 in a new folder named saved model if new model is inserted"*
- **Actions Taken:**
  - Relocated folder `1` into `saved_models/1/`.
  - Created a filesystem directory junction `saved model` pointing to `saved_models/` so both naming conventions work interchangeably.
  - Updated `backend/app/model.py` with dynamic model version resolution:
    - Scans `saved_models/` and `saved model/` for integer-named subfolders (`1`, `2`, `3`, ...).
    - Automatically discovers and loads the highest version (`max(versions)`), ensuring newly trained models are picked up immediately on server restart without code changes.
  - Added `export_model.py` utility to export the active SavedModel into `.keras` and `.h5` files.

---

### Phase 4: Botanical Nomenclature & Clean Display
- **User Prompt:**
  > *"in encyclopedia, use original name from the Medicinal Leaf Dataset folder along with scientific names"*
- **Actions Taken:**
  - Updated `LeafCard.jsx` to prominently feature the exact dataset folder name (`class_name`, e.g. `Astma_weed`, `Amruthaballi`, `Doddpathre`, `Balloon_Vine`) as the primary heading.
  - Displayed the scientific / botanical name (`botanical_name`, e.g. *Euphorbia hirta*, *Tinospora cordifolia*) directly underneath in an italic botanical style.

---

### Phase 5: Removal of Clutter & Redundant Dataset Labels
- **User Prompts:**
  > *"remove the name when the dataset folder is mentioned in encyclopedia section"*  
  > *"remove the inside that also contsins dataset folder in encyclopedia"*
- **Actions Taken:**
  - Removed alternate/secondary common names from `LeafCard.jsx` so each card cleanly displays only the dataset folder name and the scientific name.
  - Removed the `📁 Dataset Folder: ...` badge tag from the Leaf Details hero card.
  - Cleaned the description paragraph and search placeholder in `EncyclopediaPage.jsx` to eliminate repetitive "dataset folder" mentions, keeping clean botanical terminology.

---

### Phase 6: Smart Context-Aware Back Navigation
- **User Prompt:**
  > *"when we inside the description of the leaf in encyclopedia, the back page will be return to the encyclopedia rather than leaf classifier"*
- **Actions Taken:**
  - Integrated React Router navigation state in `LeafCard.jsx` (`state={{ from: 'encyclopedia' }}`) and `PredictionResult.jsx` (`state={{ from: 'classifier' }}`).
  - Updated `LeafDetailPage.jsx` to read `location.state`:
    - If accessed from the Encyclopedia: Back button displays **`← Back to Encyclopedia`** and navigates to `/directory`.
    - If accessed from the Classifier: Back button displays **`← Back to Leaf Classifier`** and navigates to `/`.
    - Adapted bottom Quick Action buttons to match the user's navigation context.

---

### Phase 7: Resolution of `tf_keras` Module Diagnostic & IDE Interpreter Configuration
- **User Prompt:**
  > *"Explain what this problem is and help me fix it: Cannot find module `tf_keras` Looked in these locations: Fallback search path ... Site package path queried from interpreter: ["C:\\Users\\Admin\\AppData\\Local\\Programs\\Python\\Python314\\..."] @[c:\project folder\Medicinal Leaf Classification\export_model.py:L9]"*
- **Root Cause Analysis:**
  - The IDE's Python language server (Pylance/Pyright) was defaulting to the global Windows Python installation (`Python 3.14` at `C:\Users\Admin\AppData\Local\Programs\Python\Python314`), where TensorFlow and `tf-keras` are not installed (and TensorFlow does not support Python 3.14).
  - The project's dedicated virtual environment (`.venv` with Python 3.12.14) already had `tensorflow 2.21.0`, `tf_keras 2.21.0`, and `keras 3.15.1` properly installed.
- **Actions Taken:**
  - Created `.vscode/settings.json` specifying `"python.defaultInterpreterPath": "${workspaceFolder}/.venv/Scripts/python.exe"` and analysis extra paths.
  - Added resilient fallback imports (`try: import keras ... except: import tf_keras ...`) to prevent import failures across different environment setups.
  - Verified `export_model.py` execution within `.venv` (exit code 0).

---

### Phase 8: Transition to Pure `.keras` Model & Workspace Cleanup
- **User Prompts:**
  > *"can we directly use .keras model instead of folder and .h5?"*  
  > *"use only .keras model and remove the unnecessary files"*
- **Rationale:**
  - Modern Keras 3 and TensorFlow 2.16+ recommend the native single-file `.keras` format over legacy HDF5 (`.h5`) and multi-file SavedModel directories.
  - Single-file `.keras` is compact (10.35–10.85 MB), self-contained, faster to distribute, and avoids deprecation warnings.
- **Actions Taken:**
  - Updated `Training.ipynb` to save the trained model directly as `saved_models/model_1.keras`.
  - Refactored `backend/app/model.py`:
    - Updated `find_latest_model()` to scan strictly for `*.keras` files inside `saved_models/` and project root.
    - Updated `LeafClassifier` to load `.keras` natively using `keras.models.load_model(..., compile=False)`.
  - Updated `backend/app/main.py` health endpoint to default to `saved_models/model_1.keras`.
  - Removed legacy, redundant, and export files:
    - 🗑️ `export_model.py` (export script no longer needed)
    - 🗑️ `medicinal_leaf_model_v1.h5` (legacy HDF5 format)
    - 🗑️ `medicinal_leaf_model_v1.keras` (duplicate in root, consolidated to `saved_models/model_1.keras`)
  - Updated `README.md` architecture diagram and technical notes.
  - Verified end-to-end model loading, health checks, and leaf predictions (all 80 classes loaded, inference successful).

---

### Phase 9: Clean Nomenclature (No Underscores) & Single Sample Leaf
- **User Prompt:**
  > *"during classification, use class names without underscore and use only one leaf instead of leaves in quick sample"*
- **Actions Taken:**
  - **Clean Class Names (No Underscores):**
    - Updated `backend/app/model.py` to strip underscores from `predicted_class` and each item in the `top_k` prediction list (e.g. `Astma_weed` → `Astma weed`, `Balloon_Vine` → `Balloon Vine`, `Malabar_Nut` → `Malabar Nut`, `Malabar_Spinach` → `Malabar Spinach`).
    - Updated `backend/app/database.py` to index both raw class names and space-separated class names in `_by_class`.
    - Updated `PredictionResult.jsx` to ensure both the main classification heading and Top-5 breakdown format names with `replace(/_/g, ' ')`.
    - Updated `LeafDetailPage.jsx` and `LeafCard.jsx` to render clean, readable plant names without underscores.
  - **Single Quick Sample Leaf:**
    - Updated `SampleGallery.jsx` to feature a single, high-fidelity sample herb: **Tulsi (Holy Basil)** (`/samples/tulsi.jpg`).
    - Redesigned the Quick Sample UI with a horizontal layout, sample badge, scientific name, and 1-click test button.
    - Updated `App.css` with responsive styling for `.sample-single-container` and `.sample-card-single`.

---

### Phase 10: Four Quick Sample Leaves from Dataset
- **User Prompt:**
  > *"use any four leaves as quick sample from Medicinal Leaf dataset"*
- **Actions Taken:**
  - Selected 4 iconic Indian medicinal leaves directly from the `Medicinal Leaf dataset/` folders, verified to achieve >98% accuracy on the trained MobileNetV2 model:
    1. **Tulsi** (`Medicinal Leaf dataset/Tulsi/20190822_173648.jpg`) — 99.24% confidence.
    2. **Neem** (`Medicinal Leaf dataset/Neem/1000.jpg`) — 99.97% confidence.
    3. **Betel** (`Medicinal Leaf dataset/Betel/1874.jpg`) — 98.01% confidence.
    4. **Doddpathre** (`Medicinal Leaf dataset/Doddpathre/100.jpg`) — 99.96% confidence.
  - Copied these genuine dataset images to `frontend/public/samples/`.
  - Updated `SampleGallery.jsx` to render the 4-card sample gallery with clean plant names and subtitles.
  - Updated `App.css` with a responsive 4-column glassmorphism grid (`.sample-grid` and `.sample-card`) with smooth hover micro-animations.
  - Verified compilation with `npm run build` and tested inference across all 4 sample leaves.

---

### Phase 11: Standard `line-clamp` Compatibility Resolution
- **User Prompt:**
  > *"Explain what this problem is and help me fix it: Also define the standard property 'line-clamp' for compatibility @[c:\project folder\Medicinal Leaf Classification\frontend\src\styles\App.css:L978]"*
- **Root Cause Analysis:**
  - Modern CSS standards (W3C CSS Overflow Module Level 3/4) standardized `line-clamp` without vendor prefixes.
  - The IDE's CSS language server warns when `-webkit-line-clamp` is used in isolation without declaring the standard `line-clamp` counterpart.
- **Actions Taken:**
  - Added `line-clamp: 2;` alongside `-webkit-line-clamp: 2;` in `.catalog-benefits-preview` ([App.css](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/frontend/src/styles/App.css#L973-L983)).
  - Executed `npm run build` in `frontend/` to ensure production assets compile smoothly without warnings.

---

### Phase 12: Standard `background-clip` Compatibility Resolution
- **User Prompt:**
  > *"Explain what this problem is and help me fix it: Also define the standard property 'background-clip' for compatibility @[c:\project folder\Medicinal Leaf Classification\frontend\src\index.css:L158]"*
- **Root Cause Analysis:**
  - Modern CSS standards (W3C CSS Backgrounds and Borders Module Level 4) standardize `background-clip: text`.
  - When `-webkit-background-clip: text;` is declared alone without its standard counterpart `background-clip: text;`, the CSS linter warns that the standard property should also be declared for cross-browser compliance and forward compatibility.
- **Actions Taken:**
  - Added `background-clip: text;` directly below `-webkit-background-clip: text;` in `.gradient-text` within [index.css](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/frontend/src/index.css#L156-L162).
  - Rebuilt production assets via `npm run build` in `frontend/` with clean verification.

---

### Phase 13: Git Repository Initialization & GitHub Remote Sync
- **User Prompt:**
  > *"update in github"*
- **Actions Taken:**
  - Created a root-level `.gitignore` configured to exclude Python virtual environments (`.venv/`), bytecode caches (`__pycache__/`, `*.pyc`), Node modules (`node_modules/`), production builds (`frontend/dist/`), and raw image dataset archives.
  - Set default branch to `main` via `git branch -M main`.
  - Staged all project files and created the initial commit: `Initial commit: AyurLeaf AI medicinal leaf classification web app` (48 files, 9,270 insertions).
  - Successfully pushed `main` branch to remote origin (`https://github.com/yogeshwaran-cse/medicinal-leaf-classification.git`).

---

## 3. Current Directory Structure

```
Medicinal Leaf Classification/
├── .venv/                              # Python 3.12 virtual environment (uv)
├── .vscode/
│   └── settings.json                   # Configured Python interpreter (.venv)
├── AGENTS.md                           # Comprehensive conversation & architecture log
├── README.md                           # Quick start and project guide
├── Training.ipynb                      # Jupyter notebook for MobileNetV2 training (outputs .keras)
├── create_leaf_db.py                   # 80-plant botanical database generator
├── saved_models/                       # Model storage directory
│   └── model_1.keras                   # Native modern Keras model (active, 10.85 MB)
├── Medicinal Leaf dataset/             # 80-species leaf image dataset
├── backend/                            # FastAPI backend managed with uv
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # API routes & static SPA distribution mount
│   │   ├── model.py                    # Native .keras model loader & inference engine
│   │   ├── database.py                 # Leaf database query manager (search & filters)
│   │   └── data/
│   │       └── leaves.json             # Comprehensive 80-leaf Ayurvedic knowledge base
│   ├── pyproject.toml                  # uv project configuration
│   ├── requirements.txt                # Python dependencies
│   └── run.py                          # Server launcher (default port: 8000)
└── frontend/                           # React frontend (Vite + Vanilla CSS)
    ├── dist/                           # Compiled production SPA bundle
    ├── public/
    │   └── samples/                    # Test images (Tulsi, Neem, Aloe Vera, Mint)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Botanical header with live model status
    │   │   ├── ImageUploader.jsx       # Drag & drop, file picker, and camera capture
    │   │   ├── PredictionResult.jsx    # Top predictions, confidence badge, top-5 meter
    │   │   ├── SampleGallery.jsx       # 1-click test sample leaves
    │   │   ├── LeafCard.jsx            # Herb card (dataset folder name + scientific name)
    │   │   └── Footer.jsx              # Footer with safety notes & credits
    │   ├── pages/
    │   │   ├── ClassifierPage.jsx      # Home classifier view
    │   │   ├── LeafDetailPage.jsx      # Dedicated leaf profile with contextual back button
    │   │   ├── EncyclopediaPage.jsx    # 80-plant catalog with live search & categories
    │   │   └── AboutPage.jsx           # Technical architecture & Ayurvedic documentation
    │   ├── styles/
    │   │   └── App.css                 # Botanical green theme, glassmorphism, responsive
    │   ├── App.jsx                     # Multi-page React Router
    │   ├── main.jsx                    # React root entry
    │   └── index.css                   # CSS tokens, typography, and resets
    ├── package.json
    └── vite.config.js                  # Vite server & API proxy config
```

---

## 4. How to Run the Application

### Backend Server (`uv` / Python 3.12)
```bash
# Start backend server on port 8000
.venv\Scripts\python.exe backend/run.py
```
- API Endpoint: `http://127.0.0.1:8000`
- API Health Check: `http://127.0.0.1:8000/api/health`
- Production SPA: `http://127.0.0.1:8000/`

### Frontend Dev Server (React + Vite)
```bash
cd frontend
npm run dev
```
- Vite Dev URL: `http://localhost:5173` (proxies `/api` calls to port 8000)

---

## 5. Summary of Key Achievements

1. **Pure Native `.keras` Architecture:** The system exclusively utilizes modern `.keras` models (`saved_models/model_1.keras`), eliminating legacy HDF5 (`.h5`) warnings and complex SavedModel folder directories.
2. **Ayurvedic Encyclopedia:** Comprehensive coverage of all 80 Indian medicinal plants with classical uses, preparation methods, and precautions.
3. **Clean Botanical Aesthetics:** Curated emerald/forest green theme with glassmorphism, mobile responsiveness, and zero visual clutter.
4. **Smart User Experience:** Live camera snapshot, drag-and-drop file upload, 1-click sample gallery, and smart contextual back navigation.
