"""
AyurLeaf AI - TensorFlow.js Model Converter
Converts saved_models/model_1.keras to TensorFlow.js Web format in frontend/public/model/
"""
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock

# Suppress TF logging noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

# Stub modules that are Linux-only or missing on Windows
sys.modules['tensorflow_decision_forests'] = MagicMock()
sys.modules['jax'] = MagicMock()
sys.modules['jax.experimental'] = MagicMock()
sys.modules['jax.experimental.jax2tf'] = MagicMock()

import tensorflow as tf  # type: ignore
try:
    import keras  # type: ignore
except ImportError:
    from tensorflow import keras  # type: ignore
try:
    import tensorflowjs as tfjs  # type: ignore
except ImportError:
    import tensorflowjs as tfjs  # type: ignore

def convert():
    workspace_root = Path(__file__).resolve().parent
    keras_model_path = workspace_root / "saved_models" / "model_1.keras"
    output_dir = workspace_root / "frontend" / "public" / "model"

    if not keras_model_path.exists():
        raise FileNotFoundError(f"Model file not found at: {keras_model_path}")

    print(f"Loading Keras model from: {keras_model_path}...")
    original_model = keras.models.load_model(str(keras_model_path), compile=False)

    print("Building clean model with dynamic batch shape [None, 224, 224, 3]...")
    # Wrap with dynamic batch input and 1/255 rescaling layer
    inputs = keras.Input(shape=(224, 224, 3), name="input_image")
    x = keras.layers.Rescaling(1.0 / 255.0)(inputs)
    # Layer 1: MobileNetV2 base model
    x = original_model.layers[1](x)
    # Layer 2: GlobalAveragePooling2D
    x = original_model.layers[2](x)
    # Layer 3: Dense (80 classes, softmax)
    outputs = original_model.layers[3](x)

    clean_model = keras.Model(inputs=inputs, outputs=outputs, name="ayurleaf_classifier")

    temp_saved_model = workspace_root / "saved_models" / "temp_tf_saved_model"
    print(f"Exporting clean model to SavedModel at: {temp_saved_model}...")
    clean_model.export(str(temp_saved_model))

    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Converting SavedModel to TensorFlow.js Graph Model at: {output_dir}...")
    tfjs.converters.convert_tf_saved_model(str(temp_saved_model), str(output_dir))

    # Clean up temporary SavedModel directory
    import shutil
    shutil.rmtree(temp_saved_model, ignore_errors=True)

    print("Conversion completed successfully!")
    print(f"Files saved in: {output_dir}")
    for file in output_dir.glob("*"):
        size_mb = file.stat().st_size / (1024 * 1024)
        print(f"  - {file.name}: {size_mb:.2f} MB")

if __name__ == "__main__":
    convert()
