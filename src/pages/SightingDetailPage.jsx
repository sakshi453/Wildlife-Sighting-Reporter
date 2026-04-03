import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSighting } from '../api/axios';
import { getCategoryBadge, formatDate } from '../utils/helpers';
import { MapPin, Clock, User, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function SightingDetailPage() {
  const { id } = useParams();
  const [sighting, setSighting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getSighting(id);
        setSighting(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse-glow" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 161, 208, 0.2)' }} />
      </div>
    );
  }

  if (!sighting) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Sighting not found</p>
        <Link to="/map" className="btn-secondary" style={{ textDecoration: 'none' }}>Back to Map</Link>
      </div>
    );
  }

  const coords = sighting.location?.coordinates;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <Link to="/map" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem',
          marginBottom: '20px', transition: 'color 0.2s',
        }}>
          <ArrowLeft size={16} /> Back to Map
        </Link>

        <div className="glass-card animate-fade-in-up" style={{ overflow: 'hidden' }}>
          {/* Image */}
          {sighting.photo?.url && (
            <img src={sighting.photo.url} alt={sighting.species} style={{
              width: '100%', maxHeight: '450px', objectFit: 'cover',
            }} />
          )}

          <div style={{ padding: '28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 className="heading-display" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                  {sighting.species}
                </h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={getCategoryBadge(sighting.category)}>{sighting.category}</span>
                  {sighting.verified && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      color: '#34D399', fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      <CheckCircle size={14} /> Verified
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <Heart size={18} /> {sighting.likes?.length || 0} likes
              </div>
            </div>

            {/* Description */}
            {sighting.description && (
              <p style={{
                color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7,
                marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--glass-border)',
              }}>
                {sighting.description}
              </p>
            )}

            {/* Details Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px', marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(32, 161, 208, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="var(--cyan-glow)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                  <div style={{ fontSize: '0.9rem' }}>{sighting.neighborhood}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={18} color="var(--amber-pulse)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Date</div>
                  <div style={{ fontSize: '0.9rem' }}>{formatDate(sighting.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#10B981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Reporter</div>
                  <div style={{ fontSize: '0.9rem' }}>{sighting.user?.username}</div>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            {coords && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '250px' }}>
                <MapContainer
                  center={[coords[1], coords[0]]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[coords[1], coords[0]]} />
                </MapContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
