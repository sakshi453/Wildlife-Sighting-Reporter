import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Map, Camera, BarChart3, User, LogOut, LogIn,
  Menu, X, Leaf, Home
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/map', label: 'Live Map', icon: Map },
    { to: '/report', label: 'Report', icon: Camera, auth: true },
    { to: '/dashboard', label: 'Dashboard', icon: User, auth: true },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const filteredLinks = navLinks.filter(l => !l.auth || user);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50" id="main-nav">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #20A1D0, #0E71AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(32, 161, 208, 0.3)',
            }}>
              <Leaf size={20} color="white" />
            </div>
            <span className="heading-display" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Wildlife<span style={{ color: 'var(--cyan-glow)' }}>Reporter</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {filteredLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
                  color: location.pathname === to ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                  background: location.pathname === to ? 'rgba(32, 161, 208, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  👋 {user.username}
                </span>
                <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}>
                  <LogIn size={14} /> Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '8px 20px' }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none', background: 'none', border: 'none',
              color: 'var(--text-primary)', cursor: 'pointer', padding: '8px',
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-nav" style={{
            padding: '16px 0', borderTop: '1px solid var(--glass-border)',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {filteredLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
                  color: location.pathname === to ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                  background: location.pathname === to ? 'rgba(32, 161, 208, 0.1)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '8px' }}>
              {user ? (
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '12px 16px', borderRadius: '10px', background: 'none',
                  border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: '0.95rem',
                }}>
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px', padding: '0 16px' }}>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
