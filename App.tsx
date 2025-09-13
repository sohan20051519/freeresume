
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TemplatesPage from './pages/TemplatesPage';
import EditorPage from './pages/EditorPage';
import { ResumeProvider } from './context/ResumeContext';
import Header from './components/Header';

function App() {
  return (
    <ResumeProvider>
      <HashRouter>
        <div className="bg-gray-100 min-h-screen font-sans">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </div>
      </HashRouter>
    </ResumeProvider>
  );
}

export default App;
