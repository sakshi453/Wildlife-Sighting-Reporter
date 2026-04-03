import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSightings } from '../api/axios';
import SightingCard from '../components/SightingCard';
import StatsWidget from '../components/StatsWidget';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye, Award, Calendar, User, Edit3, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetch = async () => {
      try {
        const { data } = await getUserSightings(user._id);
        setSightings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  if (!user) return null;

  const uniqueSpecies = [...new Set(sightings.map(s => s.species))];
  const uniqueCategories = [...new Set(sightings.map(s => s.category))];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Profile Header */}
        <div className="glass-card animate-fade-in-up" style={{
          padding: '32px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #20A1D0, #0E71AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white',
            boxShadow: '0 0 30px rgba(32, 161, 208, 0.3)',
            flexShrink: 0,
          }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="heading-display" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
              {user.username}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
              {user.bio || 'Urban wildlife enthusiast 🌿'}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Camera size={14} /> {sightings.length} sightings
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          <StatsWidget label="Total Sightings" value={sightings.length} icon={Camera} color="var(--cyan-glow)" />
          <StatsWidget label="Species Found" value={uniqueSpecies.length} icon={Eye} color="var(--amber-pulse)" />
          <StatsWidget label="Categories" value={uniqueCategories.length} icon={Award} color="#10B981" />
          <StatsWidget label="This Month" value={sightings.filter(s => {
            const d = new Date(s.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length} icon={Calendar} color="#A855F7" />
        </div>

        {/* Field Guide */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
            🦉 Your <span className="neon-text-amber">Field Guide</span>
          </h2>
          {uniqueSpecies.length > 0 ? (
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap',
            }}>
              {uniqueSpecies.map((sp) => {
                const s = sightings.find(x => x.species === sp);
                const count = sightings.filter(x => x.species === sp).length;
                return (
                  <div key={sp} className="glass-card" style={{
                    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px',
                    minWidth: '200px',
                  }}>
                    {s?.photo?.url && (
                      <img src={s.photo.url} alt={sp} style={{
                        width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover',
                      }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sp}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span className={`badge badge-${s?.category?.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{s?.category}</span>
                        {' '}· {count} sighting{count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No species recorded yet. Start reporting sightings!</p>
            </div>
          )}
        </div>

        {/* Recent Sightings */}
        <div>
          <h2 className="heading-display" style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
            📷 Your <span className="neon-text">Sightings</span>
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="animate-pulse-glow" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 161, 208, 0.2)', margin: '0 auto' }} />
            </div>
          ) : sightings.length > 0 ? (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px',
            }}>
              {sightings.map((s) => (
                <SightingCard key={s._id} sighting={s} currentUserId={user._id} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <Camera size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't reported any sightings yet</p>
              <button onClick={() => navigate('/report')} className="btn-primary">Report Your First Sighting</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
