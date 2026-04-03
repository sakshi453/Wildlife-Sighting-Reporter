import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🌿');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <div className="glass-card animate-fade-in-up" style={{
        width: '100%', maxWidth: '440px', padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #20A1D0, #0E71AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 25px rgba(32, 161, 208, 0.3)',
          }}>
            <LogIn size={26} color="white" />
          </div>
          <h1 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to continue reporting sightings
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: '10px', marginBottom: '20px', color: '#FB7185', fontSize: '0.85rem',
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" className="glass-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{ paddingLeft: '40px' }}
                id="login-email"
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" className="glass-input" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ paddingLeft: '40px' }}
                id="login-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{
            width: '100%', padding: '14px', fontSize: '0.95rem',
            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
          }} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--cyan-glow)', textDecoration: 'none', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>

        <div style={{
          marginTop: '20px', padding: '12px', borderRadius: '10px',
          background: 'rgba(32, 161, 208, 0.05)', border: '1px solid rgba(32, 161, 208, 0.1)',
          textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          Demo: nature@demo.com / demo1234
        </div>
      </div>
    </div>
  );
}
