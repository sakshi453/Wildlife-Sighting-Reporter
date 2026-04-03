import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getSightings } from '../api/axios';
import { CATEGORIES, getCategoryBadge, formatRelativeTime } from '../utils/helpers';
import { Filter, X, Search, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const categoryColors = {
  Bird: '#38BDF8', Mammal: '#FBBF24', Reptile: '#34D399',
  Amphibian: '#A855F7', Insect: '#FB7185', Fish: '#22D3EE', Other: '#8B9DC3',
};

const createCustomIcon = (category) => {
  const color = categoryColors[category] || '#8B9DC3';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50%;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 0 12px ${color}80, 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

function FitBounds({ sightings }) {
  const map = useMap();
  useEffect(() => {
    if (sightings.length > 0) {
      const bounds = L.latLngBounds(
        sightings.map(s => [s.location.coordinates[1], s.location.coordinates[0]])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [sightings, map]);
  return null;
}

export default function MapPage() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', species: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.species) params.species = filters.species;
      const { data } = await getSightings(params);
      setSightings(data.sightings || []);
    } catch (err) {
      console.error('Error fetching sightings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, [filters.category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSightings();
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 className="heading-display" style={{ fontSize: '1.6rem' }}>
              Live <span className="neon-text">Community Map</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              {sightings.length} sightings across the city
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            {showFilters ? 'Close' : 'Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="glass-card animate-fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Category
                </label>
                <select
                  className="glass-input"
                  value={filters.category}
                  onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <form onSubmit={handleSearch} style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Species
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="glass-input"
                    value={filters.species}
                    onChange={(e) => setFilters(f => ({ ...f, species: e.target.value }))}
                    placeholder="Search species..."
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }}>
                    <Search size={16} />
                  </button>
                </div>
              </form>
              {(filters.category || filters.species) && (
                <button
                  onClick={() => setFilters({ category: '', species: '' })}
                  className="btn-secondary"
                  style={{ padding: '10px 16px' }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setFilters(f => ({ ...f, category: f.category === c.value ? '' : c.value }))}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', border: 'none',
                    background: filters.category === c.value ? `${c.color}25` : 'rgba(139, 157, 195, 0.08)',
                    color: filters.category === c.value ? c.color : 'var(--text-muted)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    border: filters.category === c.value ? `1px solid ${c.color}40` : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="glass-card" style={{ overflow: 'hidden', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          {loading ? (
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '12px',
            }}>
              <div className="animate-pulse-glow" style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(32, 161, 208, 0.2)',
              }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading sightings map...</p>
            </div>
          ) : (
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <FitBounds sightings={sightings} />
              {sightings.map((s) => (
                <Marker
                  key={s._id}
                  position={[s.location.coordinates[1], s.location.coordinates[0]]}
                  icon={createCustomIcon(s.category)}
                >
                  <Popup>
                    <div style={{ minWidth: '200px', fontFamily: "'Inter', sans-serif" }}>
                      {s.photo?.url && (
                        <img src={s.photo.url} alt={s.species} style={{
                          width: '100%', height: '120px', objectFit: 'cover',
                          borderRadius: '8px', marginBottom: '8px',
                        }} />
                      )}
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: '#F0F6FC' }}>
                        {s.species}
                      </h3>
                      <span className={getCategoryBadge(s.category)} style={{ marginBottom: '6px', display: 'inline-block' }}>
                        {s.category}
                      </span>
                      {s.description && (
                        <p style={{ fontSize: '0.8rem', color: '#8B9DC3', margin: '6px 0', lineHeight: 1.4 }}>
                          {s.description}
                        </p>
                      )}
                      <div style={{ fontSize: '0.72rem', color: '#4A5E80', marginTop: '6px' }}>
                        📍 {s.neighborhood} · {formatRelativeTime(s.createdAt)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#4A5E80', marginTop: '2px' }}>
                        By {s.user?.username || 'Anonymous'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
