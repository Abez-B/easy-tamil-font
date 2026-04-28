import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LicenseBanner from './components/LicenseBanner';
import Footer from './components/Footer';
import Home from './pages/Home';
import FontDetail from './pages/FontDetail';
import License from './pages/License';
import Contributing from './pages/Contributing';
import Tools from './pages/Tools';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <LicenseBanner />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/font/:id" element={<FontDetail />} />
            <Route path="/license" element={<License />} />
            <Route path="/contributing" element={<Contributing />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
