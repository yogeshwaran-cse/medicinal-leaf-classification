import io
import os
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
from PIL import Image

# Suppress TensorFlow logging noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

try:
    import keras
except ImportError:
    try:
        import tf_keras as keras
    except ImportError:
        from tensorflow import keras

from .database import db

CLASS_NAMES = [
    'Aloevera', 'Amla', 'Amruthaballi', 'Arali', 'Astma_weed',
    'Badipala', 'Balloon_Vine', 'Bamboo', 'Beans', 'Betel',
    'Bhrami', 'Bringaraja', 'Caricature', 'Castor', 'Catharanthus',
    'Chakte', 'Chilly', 'Citron lime (herelikai)', 'Coffee', 'Common rue(naagdalli)',
    'Coriender', 'Curry', 'Doddpathre', 'Drumstick', 'Ekka',
    'Eucalyptus', 'Ganigale', 'Ganike', 'Gasagase', 'Ginger',
    'Globe Amarnath', 'Guava', 'Henna', 'Hibiscus', 'Honge',
    'Insulin', 'Jackfruit', 'Jasmine', 'Kambajala', 'Kasambruga',
    'Kohlrabi', 'Lantana', 'Lemon', 'Lemongrass', 'Malabar_Nut',
    'Malabar_Spinach', 'Mango', 'Marigold', 'Mint', 'Neem',
    'Nelavembu', 'Nerale', 'Nooni', 'Onion', 'Padri',
    'Palak(Spinach)', 'Papaya', 'Parijatha', 'Pea', 'Pepper',
    'Pomoegranate', 'Pumpkin', 'Raddish', 'Rose', 'Sampige',
    'Sapota', 'Seethaashoka', 'Seethapala', 'Spinach1', 'Tamarind',
    'Taro', 'Tecoma', 'Thumbe', 'Tomato', 'Tulsi',
    'Turmeric', 'ashoka', 'camphor', 'kamakasturi', 'kepala'
]

class LeafClassifier:
    def __init__(self, model_path: str = None):
        if model_path is None:
            model_path, version = self.find_latest_model()

        if not model_path:
            raise FileNotFoundError("Could not locate any .keras model file in 'saved_models' or project directory")

        self.model_dir = str(model_path)
        self.model_version = version
        print(f"Loading .keras model (version {self.model_version}) from '{self.model_dir}'...")
        try:
            import keras
            self.model = keras.models.load_model(self.model_dir, compile=False)
        except Exception:
            import tf_keras
            self.model = tf_keras.models.load_model(self.model_dir, compile=False)
        print(f"Model version {self.model_version} loaded successfully!")

    @staticmethod
    def find_latest_model():
        """
        Dynamically discovers the highest version .keras model file:
        Checks inside 'saved_models' and the workspace root.
        """
        import re
        workspace_root = Path(__file__).resolve().parent.parent.parent
        search_dirs = [
            workspace_root / "saved_models",
            Path("saved_models"),
            workspace_root,
            Path("."),
        ]

        def extract_version(file_path: Path) -> int:
            # Matches version numbers like model_1.keras, medicinal_leaf_model_v1.keras, 1.keras
            m = re.search(r'(?:v|_|^)(\d+)\.keras$', file_path.name, re.IGNORECASE)
            return int(m.group(1)) if m else 1

        for directory in search_dirs:
            if directory.exists() and directory.is_dir():
                keras_files = [f for f in directory.glob("*.keras") if not f.name.startswith(".")]
                if keras_files:
                    keras_files.sort(key=extract_version, reverse=True)
                    best = keras_files[0]
                    ver = extract_version(best)
                    print(f"Found .keras model: '{best}' (version {ver})")
                    return str(best), ver

        return None, None

    def predict(self, image_bytes: bytes, top_k: int = 5) -> Dict[str, Any]:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize((224, 224), Image.Resampling.BILINEAR)

        # Convert to numpy array shape (1, 224, 224, 3) in range 0-255
        img_array = np.array(image, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Forward pass
        predictions = self.model.predict(img_array, verbose=0)[0]

        # Get sorted indices in descending order
        top_indices = np.argsort(predictions)[::-1][:top_k]

        results: List[Dict[str, Any]] = []
        for idx in top_indices:
            raw_c_name = CLASS_NAMES[idx]
            clean_name = raw_c_name.replace("_", " ")
            conf = float(predictions[idx])
            leaf_info = db.get_by_name_or_id(raw_c_name)
            results.append({
                "class_name": clean_name,
                "raw_class": raw_c_name,
                "confidence": round(conf * 100, 2),
                "probability": float(conf),
                "leaf_details": leaf_info
            })

        top_pred = results[0]
        is_reliable = top_pred["confidence"] >= 35.0

        return {
            "predicted_class": top_pred["class_name"],
            "raw_class": top_pred["raw_class"],
            "confidence": top_pred["confidence"],
            "is_reliable": is_reliable,
            "leaf_details": top_pred["leaf_details"],
            "top_k": results
        }


# Global lazy or eager instance
_classifier = None

def get_classifier() -> LeafClassifier:
    global _classifier
    if _classifier is None:
        _classifier = LeafClassifier()
    return _classifier
