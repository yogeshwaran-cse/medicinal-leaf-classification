import React from 'react';
import { Sparkles } from 'lucide-react';

const SAMPLES = [
  {
    id: 'tulsi',
    name: 'Tulsi',
    subtitle: 'Holy Basil',
    file: '/samples/tulsi.jpg'
  },
  {
    id: 'neem',
    name: 'Neem',
    subtitle: 'Indian Lilac',
    file: '/samples/neem.jpg'
  },
  {
    id: 'betel',
    name: 'Betel',
    subtitle: 'Paan Leaf',
    file: '/samples/betel.jpg'
  },
  {
    id: 'doddpathre',
    name: 'Doddpathre',
    subtitle: 'Indian Borage',
    file: '/samples/doddpathre.jpg'
  }
];

export default function SampleGallery({ onSelectSample, isAnalyzing }) {
  const handleSampleClick = async (sample) => {
    if (isAnalyzing) return;
    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      onSelectSample(file, sample.file);
    } catch (err) {
      console.error("Failed to load sample image:", err);
    }
  };

  return (
    <div className="sample-section">
      <div className="sample-title">
        <Sparkles size={14} style={{ color: '#34d399' }} />
        <span>Or Test with Quick Samples:</span>
      </div>
      <div className="sample-grid">
        {SAMPLES.map((s) => (
          <div
            key={s.id}
            className="sample-card"
            onClick={() => handleSampleClick(s)}
            title={`Click to test AI classification on ${s.name}`}
            role="button"
            tabIndex={0}
          >
            <img src={s.file} alt={s.name} className="sample-thumb" />
            <div className="sample-card-text">
              <span className="sample-name">{s.name}</span>
              <span className="sample-sub">{s.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
