import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { createSighting } from '../api/axios';
import { CATEGORIES } from '../utils/helpers';
import {
  Camera, MapPin, Tag, FileText, Check, ChevronRight,
  ChevronLeft, Upload, Crosshair, Loader, AlertCircle, ImagePlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { label: 'Photo', icon: Camera },
  { label: 'Location', icon: MapPin },
  { label: 'Species', icon: Tag },
  { label: 'Review', icon: Check },
];

export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { position, loading: geoLoading, error: geoError, getPosition } = useGeolocation();
  const fileRef = useRef(null);

  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!photo || !species || !category || !position) {
      toast.error('Please complete all steps');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('species', species);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('latitude', position.latitude);
      formData.append('longitude', position.longitude);
      formData.append('neighborhood', neighborhood || 'Unknown');

      await createSighting(formData);
      toast.success('Sighting reported successfully! 🎉');
      navigate('/map');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit sighting');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!photo;
      case 1: return !!position;
      case 2: return !!species && !!category;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
            Report a <span className="neon-text">Sighting</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Capture and share your wildlife encounter
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '32px',
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                onClick={() => i < step && setStep(i)}
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= step ? 'linear-gradient(135deg, #20A1D0, #0E71AA)' : 'rgba(139, 157, 195, 0.1)',
                  border: i <= step ? 'none' : '1px solid var(--glass-border)',
                  cursor: i < step ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  boxShadow: i === step ? '0 0 15px rgba(32, 161, 208, 0.3)' : 'none',
                }}>
                <s.icon size={18} color={i <= step ? 'white' : 'var(--text-muted)'} />
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '32px', height: '2px',
                  background: i < step ? 'var(--cyan-glow)' : 'var(--glass-border)',
                  borderRadius: '1px', transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card animate-fade-in" style={{ padding: '32px' }}>
          {/* Step 0: Photo */}
          {step === 0 && (
            <div>
              <h2 className="heading-display" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
                📸 Upload Wildlife Photo
              </h2>
              {!preview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '2px dashed var(--glass-border)', borderRadius: '16px',
                    padding: '48px 32px', textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.3s ease', background: 'rgba(32, 161, 208, 0.03)',
                  }}
                >
                  <ImagePlus size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '8px' }}>
                    Drag & drop your photo here
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    or click to browse · JPG, PNG, WebP
                  </p>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Preview" style={{
                    width: '100%', maxHeight: '350px', objectFit: 'cover',
                    borderRadius: '12px',
                  }} />
                  <button
                    onClick={() => { setPhoto(null); setPreview(''); }}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '8px',
                      color: 'white', padding: '6px 12px', cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              )}
              <input
                ref={fileRef} type="file" accept="image/*"
                onChange={handlePhotoChange} style={{ display: 'none' }}
                id="photo-upload"
              />
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div>
              <h2 className="heading-display" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
                📍 Capture Location
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                We'll automatically tag your GPS coordinates.
              </p>

              {!position ? (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={getPosition}
                    disabled={geoLoading}
                    className="btn-primary"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '16px 32px', fontSize: '1rem',
                    }}
                  >
                    {geoLoading ? <Loader size={18} className="animate-spin" /> : <Crosshair size={18} />}
                    {geoLoading ? 'Getting location...' : 'Enable GPS'}
                  </button>
                  {geoError && (
                    <div style={{
                      marginTop: '16px', padding: '12px', borderRadius: '10px',
                      background: 'rgba(244, 63, 94, 0.1)', color: '#FB7185', fontSize: '0.85rem',
                      display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                    }}>
                      <AlertCircle size={16} /> {geoError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', marginBottom: '12px', fontWeight: 600 }}>
                    <Check size={18} /> Location Captured
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Latitude</span>
                      <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{position.latitude.toFixed(6)}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Longitude</span>
                      <div style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{position.longitude.toFixed(6)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  Neighborhood (optional)
                </label>
                <input
                  className="glass-input" value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Central Park District"
                  id="neighborhood-input"
                />
              </div>
            </div>
          )}

          {/* Step 2: Species */}
          {step === 2 && (
            <div>
              <h2 className="heading-display" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
                🏷️ Classify the Species
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      style={{
                        padding: '12px', borderRadius: '12px', border: 'none',
                        background: category === c.value ? `${c.color}20` : 'rgba(139, 157, 195, 0.06)',
                        border: category === c.value ? `2px solid ${c.color}60` : '2px solid transparent',
                        color: category === c.value ? c.color : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        fontSize: '0.85rem', fontWeight: 500,
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{c.emoji}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  Species Name
                </label>
                <input
                  className="glass-input" value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="e.g. House Sparrow, Indian Squirrel"
                  required id="species-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                  Description (optional)
                </label>
                <textarea
                  className="glass-input" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was the animal doing? Where exactly did you spot it?"
                  rows={3} style={{ resize: 'vertical' }}
                  id="description-input"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h2 className="heading-display" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                ✅ Review Your Sighting
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                {preview && (
                  <img src={preview} alt="Sighting" style={{
                    width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px',
                  }} />
                )}

                <div className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Species</span>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{species}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Category</span>
                      <div><span className={getCategoryBadge(category)}>{category}</span></div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location</span>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {position?.latitude.toFixed(4)}, {position?.longitude.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Neighborhood</span>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{neighborhood || 'Not specified'}</div>
                    </div>
                  </div>
                  {description && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Notes</span>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '12px',
        }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="btn-secondary"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px',
              opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="btn-primary"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px',
                opacity: !canProceed() ? 0.5 : 1, cursor: !canProceed() ? 'not-allowed' : 'pointer',
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 32px',
                opacity: submitting ? 0.7 : 1,
              }}
              id="submit-sighting"
            >
              {submitting ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
              {submitting ? 'Uploading...' : 'Submit Sighting'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
