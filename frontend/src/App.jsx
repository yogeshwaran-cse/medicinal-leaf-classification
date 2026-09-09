import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClassifierPage from './pages/ClassifierPage';
import LeafDetailPage from './pages/LeafDetailPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import AboutPage from './pages/AboutPage';
import './styles/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ClassifierPage />} />
            <Route path="/leaf/:id" element={<LeafDetailPage />} />
            <Route path="/directory" element={<EncyclopediaPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
