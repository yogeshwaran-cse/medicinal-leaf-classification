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
├── Evaluate_Metrics.ipynb         # Standalone notebook for detailed model metrics & error evaluation
├── evaluation_results/            # Generated metrics CSVs and publication-grade evaluation charts
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

6. **Comprehensive Model Metrics & Performance Evaluation (`Evaluate_Metrics.ipynb`):**
   - Standalone evaluation notebook for in-depth statistical analysis on the trained model (`saved_models/model_1.keras`).
   - Evaluates Top-1 Accuracy, Top-5 Categorical Accuracy, Sparse Categorical Cross-Entropy Loss, Macro/Weighted Precision, Recall, and F1-Score.
   - Full 80-class Scikit-Learn Classification Report with ranking of Top 10 best-performing vs 10 most challenging species.
   - High-resolution Seaborn Confusion Matrix Heatmap and morphological misclassification analysis.
   - Softmax confidence density distribution (Correct vs Misclassified) and sample image verification grid.
   - Automatically exports CSV reports and high-resolution plots to `evaluation_results/`.

---

## Model Evaluation & Performance Benchmark Results

The MobileNetV2 architecture was quantitatively evaluated on the unseen 10% hold-out test set (672 images, 21 batches of 32 images across all 80 classes) using [`Evaluate_Metrics.ipynb`](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/Evaluate_Metrics.ipynb).

### 1. Overall Performance Metrics Summary

| Evaluation Metric | Test Score | Description |
| :--- | :---: | :--- |
| **Top-1 Accuracy** | **89.43%** | Proportion of test samples where the highest confidence prediction is exactly correct |
| **Top-5 Categorical Accuracy** | **99.11%** | Proportion where the true medicinal species is within the top-5 predicted candidates |
| **Test Cross-Entropy Loss** | **0.3482** | Sparse categorical cross-entropy test loss across all 80 classes |
| **Macro Precision** | **91.34%** | Unweighted mean precision across all 80 species |
| **Macro Recall** | **90.74%** | Unweighted mean sensitivity across all 80 species |
| **Macro F1-Score** | **89.59%** | Harmonic mean of macro precision and recall |
| **Weighted Precision** | **92.67%** | Precision weighted by each class's test sample count |
| **Weighted Recall** | **89.43%** | Recall weighted by each class's test sample count |
| **Weighted F1-Score** | **89.75%** | F1-Score weighted by each class's test sample count |
| **Inference Latency** | **13.44 ms / img** | Fast CPU inference speed (74.4 images/second throughput) |
| **Evaluated Samples** | **672 images** | 10% hold-out test split of 6,900 images (`seed=14`) |

---

### 2. Species Performance Tier Distribution

Across the 80 distinct medicinal plant species in the test dataset:

```
Performance Tiers (F1-Score):
├── 🏆 100% F1-Score (Flawless)   : 24 species (30.0%)
├── 🟢 90% – 99% F1-Score (High)   : 24 species (30.0%)
├── 🟡 80% – 89% F1-Score (Good)   : 20 species (25.0%)
└── 🟠 < 80% F1-Score (Challenging): 12 species (15.0%)
```

- **Top Performing Species (100% F1-Score):**  
  *Balloon Vine*, *Bamboo*, *Castor*, *Chakte*, *Drumstick*, *Ekka*, *Eucalyptus*, *Ganigale*, *Honge*, *Jasmine*, *Kambajala*, *Lemongrass*, *Malabar Spinach*, *Mango*, *Marigold*, and 9 other species achieved 100% precision, recall, and F1-score.
- **Top-5 Safety Net (99.11%):**  
  For challenging species with subtle morphological leaf similarities (such as *Seethapala*, *Kamakasturi*, *Citron lime*, and *Astma weed*), the model's **99.11% Top-5 accuracy** ensures that the correct plant species is almost always surfaced among the top recommendations.

---

### 3. Morphological Error & Misclassification Analysis

Analysis of the 80&times;80 confusion matrix (`evaluation_results/top_confused_leaf_pairs.csv`) reveals that misclassifications are concentrated among leaves sharing very similar shape, texture, and margin characteristics:
- **Amla &rarr; Pomegranate** (2 misclassifications, 22.2% error rate of true class) &mdash; both exhibit small, narrow, oblong pinnate/sub-opposite leaflets.
- **Curry &rarr; Guava / Nerale** (2 misclassifications each, 10.5% error rate) &mdash; sharing similar elliptical lamina and acute apices.
- **Globe Amaranth &rarr; Kamakasturi** (2 misclassifications, 20.0% error rate) &mdash; sharing pubescent ovate leaf structures.
- **Tamarind &rarr; Coffee** (2 misclassifications, 9.1% error rate).

---

### 4. Generated Artifacts & Evaluation Reports

All evaluation data, reports, and publication-ready plots are saved in [`evaluation_results/`](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/evaluation_results):
- [`model_metrics_summary.csv`](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/evaluation_results/model_metrics_summary.csv) &mdash; Overall summary metrics table
- [`classification_report_all_classes.csv`](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/evaluation_results/classification_report_all_classes.csv) &mdash; Precision, recall, F1, and support for all 80 species
- [`top_confused_leaf_pairs.csv`](file:///c:/project%20folder/Medicinal%20Leaf%20Classification/evaluation_results/top_confused_leaf_pairs.csv) &mdash; Morphological confusion breakdown
- `confusion_matrix_heatmap.png` &mdash; High-resolution 80-class confusion matrix heatmap
- `top_bottom_species_f1.png` &mdash; Dual horizontal bar chart ranking top 10 vs bottom 10 species
- `confidence_distribution.png` &mdash; KDE density curves for prediction confidence
- `sample_test_predictions_grid.png` &mdash; Visual verification grid with color-coded ground-truth borders

---

## Dataset & Attribution

This project is trained on the authentic **[Indian Medicinal Leaves Dataset](https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset)** created and shared by **Arya Shah** on Kaggle.

- **Dataset URL:** [https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset](https://www.kaggle.com/datasets/aryashah2k/indian-medicinal-leaves-dataset)
- **Dataset Creator:** [Arya Shah](https://www.kaggle.com/aryashah2k)
- **Scope & Highlights:** Thousands of botanical leaf images covering 80 distinct medicinal plant species commonly used across Indian Ayurvedic, Siddha, and traditional herbal medicine systems.
- **Model Training:** MobileNetV2 transfer learning architecture fine-tuned with 224&times;224 RGB input resolution, reaching high multi-class accuracy across all 80 species.

