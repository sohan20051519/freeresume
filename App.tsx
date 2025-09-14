
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TemplatesPage from './pages/TemplatesPage';
import EditorPage from './pages/EditorPage';
import { ResumeProvider } from './context/ResumeContext';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ResumeProvider>
      <HashRouter>
        <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/editor" element={<EditorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ResumeProvider>
  );
}

export default App;