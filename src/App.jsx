import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SightingDetailPage from './pages/SightingDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(14, 30, 54, 0.9)',
              backdropFilter: 'blur(20px)',
              color: '#F0F6FC',
              border: '1px solid rgba(32, 161, 208, 0.2)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#F0F6FC' },
            },
            error: {
              iconTheme: { primary: '#F43F5E', secondary: '#F0F6FC' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/sighting/:id" element={<SightingDetailPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
