import { getCategoryBadge, formatRelativeTime } from '../utils/helpers';
import { MapPin, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SightingCard({ sighting, onLike, currentUserId }) {
  const isLiked = currentUserId && sighting.likes?.includes(currentUserId);

  return (
    <div className="glass-card animate-fade-in-up" style={{ overflow: 'hidden' }} id={`sighting-${sighting._id}`}>
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={sighting.photo?.url}
          alt={sighting.species}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
        }}>
          <span className={getCategoryBadge(sighting.category)}>
            {sighting.category}
          </span>
        </div>
        {sighting.verified && (
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(16, 185, 129, 0.2)', color: '#34D399',
            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
          }}>
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <Link to={`/sighting/${sighting._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)',
            marginBottom: '6px', fontFamily: "'Outfit', sans-serif",
          }}>
            {sighting.species}
          </h3>
        </Link>

        {sighting.description && (
          <p style={{
            fontSize: '0.85rem', color: 'var(--text-secondary)',
            marginBottom: '12px', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {sighting.description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} /> {sighting.neighborhood}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {formatRelativeTime(sighting.createdAt)}
          </span>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '12px', borderTop: '1px solid var(--glass-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #20A1D0, #0E71AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'white',
            }}>
              {sighting.user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {sighting.user?.username || 'Anonymous'}
            </span>
          </div>

          {onLike && (
            <button
              onClick={() => onLike(sighting._id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: isLiked ? 'var(--rose)' : 'var(--text-muted)',
                fontSize: '0.8rem', transition: 'all 0.3s ease',
              }}
            >
              <Heart size={15} fill={isLiked ? 'var(--rose)' : 'none'} />
              {sighting.likes?.length || 0}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
