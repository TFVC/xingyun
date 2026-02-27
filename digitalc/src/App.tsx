import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/Home';
import Knowledge from './pages/Knowledge/Knowledge';
import Scenarios from './pages/Interactive/Scenarios';
import Quiz from './pages/Interactive/Quiz';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/interactive" element={<Scenarios />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
