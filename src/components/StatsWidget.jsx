import { useEffect, useState } from 'react';

export default function StatsWidget({ label, value, icon: Icon, suffix = '', color = 'var(--cyan-glow)' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = parseInt(value) || 0;
    if (numValue === 0) { setDisplayValue(0); return; }

    const duration = 1200;
    const steps = 40;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px',
      }}>
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div className="heading-display" style={{ fontSize: '1.8rem', color, marginBottom: '4px' }}>
        {displayValue}{suffix}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
