from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Optional, List, Dict, Any
from .database import db
from .model import get_classifier, CLASS_NAMES

app = FastAPI(
    title="Indian Medicinal Leaf Classification API",
    description="Deep Learning API for classifying 80 species of Indian medicinal plants with comprehensive Ayurvedic metadata.",
    version="1.0.0"
)

# Enable CORS for frontend during development (e.g., Vite on port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Warm up classifier model on server startup
    try:
        get_classifier()
        print("Leaf classification model loaded and warmed up!")
    except Exception as e:
        print(f"Warning: Model could not be loaded at startup: {e}")

@app.get("/api/health")
def health_check():
    classifier = get_classifier()
    return {
        "status": "online",
        "model": "MobileNetV2 Transfer Learning",
        "model_version": getattr(classifier, "model_version", 1),
        "model_path": getattr(classifier, "model_dir", "saved_models/model_1.keras"),
        "total_classes": len(CLASS_NAMES),
        "classes": CLASS_NAMES
    }

@app.get("/api/categories")
def get_categories():
    return {
        "categories": db.get_categories()
    }

@app.get("/api/leaves")
def list_leaves(
    search: Optional[str] = Query(None, description="Search by common, scientific, or regional name"),
    category: Optional[str] = Query(None, description="Filter by health category")
):
    results = db.get_all(search=search, category=category)
    return {
        "count": len(results),
        "leaves": results
    }

@app.get("/api/leaves/{identifier}")
def get_leaf(identifier: str):
    leaf = db.get_by_name_or_id(identifier)
    if not leaf:
        raise HTTPException(status_code=404, detail=f"Leaf '{identifier}' not found in botanical database")
    return leaf

@app.post("/api/predict")
async def predict_leaf(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File uploaded is not a valid image")

    try:
        contents = await file.read()
        classifier = get_classifier()
        result = classifier.predict(contents, top_k=5)
        return {
            "success": True,
            "filename": file.filename,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

# Mount static frontend build if present
dist_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if dist_dir.exists():
    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
    
    samples_dir = dist_dir / "samples"
    if samples_dir.exists():
        app.mount("/samples", StaticFiles(directory=str(samples_dir)), name="samples")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = dist_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_dir / "index.html")
