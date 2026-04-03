import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, Camera, BarChart3, Users, Leaf, ArrowRight, Globe, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    { icon: Camera, title: 'Photograph & Log', desc: 'Upload wildlife photos with automatic geotagging and species categorization.', color: '#20A1D0' },
    { icon: Map, title: 'Live Community Map', desc: 'See real-time sightings across your city with interactive filters.', color: '#F59E0B' },
    { icon: BarChart3, title: 'Biodiversity Analytics', desc: 'Track urban wildlife trends with monthly health checks and species rankings.', color: '#10B981' },
    { icon: Users, title: 'Citizen Science Network', desc: 'Join a community of urban naturalists contributing to biodiversity research.', color: '#A855F7' },
  ];

  const stats = [
    { value: '1,200+', label: 'Wildlife Sightings' },
    { value: '85+', label: 'Species Recorded' },
    { value: '340+', label: 'Active Reporters' },
    { value: '12', label: 'City Neighborhoods' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px 60px', position: 'relative', minHeight: '85vh',
      }}>
        {/* Floating decorative orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: '200px', height: '200px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(32, 161, 208, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)', animation: 'float 10s ease-in-out infinite reverse',
        }} />

        <div className="animate-fade-in-up" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px', marginBottom: '24px',
            background: 'rgba(32, 161, 208, 0.1)', border: '1px solid rgba(32, 161, 208, 0.2)',
            fontSize: '0.8rem', color: 'var(--cyan-glow)', fontWeight: 500,
          }}>
            <Globe size={14} /> Urban Biodiversity Platform by Tech Wasps
          </div>

          <h1 className="heading-display" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.1, marginBottom: '20px',
            background: 'linear-gradient(135deg, #F0F6FC 0%, #20A1D0 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Report. Discover. Protect
            <br />Urban Wildlife.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)',
            lineHeight: 1.6, marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px',
          }}>
            Become a citizen scientist. Capture wildlife encounters in your city,
            contribute to biodiversity research, and help urban planners protect local ecosystems.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/report' : '/register'} className="btn-primary" style={{
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', fontSize: '1rem',
            }}>
              {user ? 'Report Sighting' : 'Get Started'} <ArrowRight size={18} />
            </Link>
            <Link to="/map" className="btn-secondary" style={{
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', fontSize: '1rem',
            }}>
              <Map size={18} /> Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ padding: '0 24px 60px' }}>
        <div className="glass-card" style={{
          maxWidth: '900px', margin: '0 auto', padding: '32px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="heading-display neon-text" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="animate-fade-in-up">
            <h2 className="heading-display" style={{ fontSize: '2rem', marginBottom: '12px' }}>
              How It <span className="neon-text">Works</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              A simple workflow designed for casual urban users.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px',
          }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card animate-fade-in-up" style={{
                padding: '28px', animationDelay: `${i * 0.1}s`, opacity: 0,
              }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '14px',
                  background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 className="heading-display" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="heading-display" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>
            Your <span className="neon-text-amber">Journey</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { step: '01', title: 'Spot Wildlife', desc: 'Encounter an animal in your urban area', icon: '🔭' },
              { step: '02', title: 'Photograph & Tag', desc: 'Upload your photo — GPS and time are auto-captured', icon: '📸' },
              { step: '03', title: 'Classify Species', desc: 'Select the species category and add a description', icon: '🏷️' },
              { step: '04', title: 'Share & Discover', desc: 'Your sighting appears on the live map for all to see', icon: '🌍' },
            ].map((s, i) => (
              <div key={i} className="glass-card animate-fade-in-up" style={{
                display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px',
                animationDelay: `${i * 0.1}s`, opacity: 0,
              }}>
                <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--cyan-glow)', letterSpacing: '0.1em' }}>
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="heading-display" style={{ fontSize: '1rem', marginBottom: '2px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <div className="glass-card" style={{
          maxWidth: '700px', margin: '0 auto', padding: '48px 32px',
          background: 'linear-gradient(135deg, rgba(32, 161, 208, 0.08), rgba(14, 113, 170, 0.05))',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <Shield size={20} color="var(--cyan-glow)" />
            <Zap size={20} color="var(--amber-pulse)" />
            <Leaf size={20} color="var(--emerald)" />
          </div>
          <h2 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
            Ready to make a difference?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Every sighting you report helps build a clearer picture of urban biodiversity.
          </p>
          <Link to={user ? '/report' : '/register'} className="btn-primary" style={{
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 36px', fontSize: '1rem',
          }}>
            Start Reporting <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)', padding: '24px',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem',
      }}>
        <p>© 2024 Wildlife Sighting Reporter — Built by <span style={{ color: 'var(--cyan-glow)' }}>Tech Wasps</span> 🐝</p>
      </footer>
    </div>
  );
}
