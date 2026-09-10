import * as tf from '@tensorflow/tfjs';
import leavesData from '../data/leaves.json';

// 80 Class names corresponding to the MobileNetV2 trained model
export const CLASS_NAMES = [
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
];

// Pre-index leaves database for instant lookup
const leavesByClass = new Map();
leavesData.forEach(leaf => {
  if (leaf.class_name) {
    leavesByClass.set(leaf.class_name.toLowerCase(), leaf);
    leavesByClass.set(leaf.class_name.toLowerCase().replace(/_/g, ' '), leaf);
  }
  if (leaf.name) {
    leavesByClass.set(leaf.name.toLowerCase(), leaf);
  }
  if (leaf.id) {
    leavesByClass.set(leaf.id.toLowerCase(), leaf);
  }
});

export function getLeafDetails(rawClassName) {
  if (!rawClassName) return null;
  const key = rawClassName.toLowerCase();
  return leavesByClass.get(key) || leavesByClass.get(key.replace(/_/g, ' ')) || null;
}

export function formatPlantName(rawName) {
  if (!rawName) return '';
  return rawName.replace(/_/g, ' ');
}

// Singleton model state
let modelInstance = null;
let initPromise = null;
const statusListeners = new Set();
let currentStatus = { ready: false, loading: false, error: null, backend: null };

function notifyListeners() {
  statusListeners.forEach(fn => fn({ ...currentStatus }));
}

export function subscribeModelStatus(fn) {
  statusListeners.add(fn);
  fn({ ...currentStatus });
  return () => statusListeners.delete(fn);
}

/**
 * Loads the TensorFlow.js model and warms up WebGL shaders.
 */
export async function initClassifier() {
  if (modelInstance) {
    return modelInstance;
  }
  if (initPromise) {
    return initPromise;
  }

  currentStatus = { ready: false, loading: true, error: null, backend: null };
  notifyListeners();

  initPromise = (async () => {
    try {
      // Set backend to WebGL if available, fallback to CPU
      try {
        await tf.setBackend('webgl');
      } catch (e) {
        console.warn("[AyurLeaf AI] WebGL initialization failed, falling back to CPU:", e);
        await tf.setBackend('cpu');
      }
      await tf.ready();
      const activeBackend = tf.getBackend();

      console.log(`[AyurLeaf AI] Initializing TensorFlow.js with ${activeBackend} backend...`);
      const model = await tf.loadGraphModel('/model/model.json');

      // Shader compilation & warm-up pass
      tf.tidy(() => {
        const dummy = tf.zeros([1, 224, 224, 3]);
        model.predict(dummy);
      });

      modelInstance = model;
      currentStatus = { ready: true, loading: false, error: null, backend: activeBackend };
      console.log(`[AyurLeaf AI] Graph model loaded and warmed up successfully (${activeBackend})!`);
      notifyListeners();
      return modelInstance;
    } catch (err) {
      console.error("[AyurLeaf AI] Failed to load TensorFlow.js model:", err);
      currentStatus = { ready: false, loading: false, error: err.message, backend: null };
      notifyListeners();
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Loads an image from a URL, File, or Blob into an HTMLImageElement
 */
function loadImageElement(source) {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLImageElement && source.complete && source.naturalWidth > 0) {
      return resolve(source);
    }
    const img = new Image();
    
    // Only set crossOrigin for remote absolute URLs
    if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for classification'));

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else {
      reject(new Error('Invalid image source provided'));
    }
  });
}

/**
 * Classifies a leaf image client-side using WebGL hardware acceleration.
 * @param {HTMLImageElement|HTMLCanvasElement|File|Blob|string} imageSource
 * @param {number} topK - Number of top predictions to return (default 5)
 */
export async function classifyImage(imageSource, topK = 5) {
  const startTime = performance.now();
  const model = await initClassifier();

  const imgEl = await loadImageElement(imageSource);

  // Preprocess image to tensor: [1, 224, 224, 3] in [0, 255] float32
  const inputTensor = tf.tidy(() => {
    const pixels = tf.browser.fromPixels(imgEl);
    const resized = tf.image.resizeBilinear(pixels, [224, 224]);
    return resized.expandDims(0);
  });

  try {
    const outputTensor = model.predict(inputTensor);
    const probabilities = await outputTensor.data();
    outputTensor.dispose();

    // Map probabilities with class indices
    const classScores = Array.from(probabilities).map((prob, idx) => ({
      index: idx,
      raw_class: CLASS_NAMES[idx],
      class_name: formatPlantName(CLASS_NAMES[idx]),
      probability: prob,
      confidence: parseFloat((prob * 100).toFixed(2)),
      leaf_details: getLeafDetails(CLASS_NAMES[idx])
    }));

    // Sort descending by confidence
    classScores.sort((a, b) => b.probability - a.probability);

    const topPredictions = classScores.slice(0, topK);
    const topPred = topPredictions[0];
    const duration = Math.round(performance.now() - startTime);

    return {
      predicted_class: topPred.class_name,
      raw_class: topPred.raw_class,
      confidence: topPred.confidence,
      probability: topPred.probability,
      is_reliable: topPred.confidence >= 35.0,
      leaf_details: topPred.leaf_details,
      top_k: topPredictions,
      inference_time_ms: duration,
      backend: tf.getBackend()
    };
  } finally {
    inputTensor.dispose();
  }
}
