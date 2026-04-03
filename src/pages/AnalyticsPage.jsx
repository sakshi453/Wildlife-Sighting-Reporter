import { useState, useEffect } from 'react';
import { getHealthCheck, getTopSpecies, getTrends, getHotspots } from '../api/axios';
import StatsWidget from '../components/StatsWidget';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Activity, TrendingUp, Trophy, MapPin, BarChart3, Leaf } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#8B9DC3', font: { family: "'Inter', sans-serif", size: 11 } } },
    tooltip: {
      backgroundColor: 'rgba(14, 30, 54, 0.9)',
      borderColor: 'rgba(32, 161, 208, 0.2)',
      borderWidth: 1,
      titleColor: '#F0F6FC',
      bodyColor: '#8B9DC3',
      titleFont: { family: "'Inter', sans-serif" },
      bodyFont: { family: "'Inter', sans-serif" },
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    x: { ticks: { color: '#4A5E80', font: { size: 10 } }, grid: { color: 'rgba(32, 161, 208, 0.06)' } },
    y: { ticks: { color: '#4A5E80', font: { size: 10 } }, grid: { color: 'rgba(32, 161, 208, 0.06)' } },
  },
};

export default function AnalyticsPage() {
  const [health, setHealth] = useState(null);
  const [topSpecies, setTopSpecies] = useState([]);
  const [trends, setTrends] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [h, ts, tr, hs] = await Promise.all([
          getHealthCheck(), getTopSpecies(6), getTrends(6), getHotspots(),
        ]);
        setHealth(h.data);
        setTopSpecies(ts.data);
        setTrends(tr.data);
        setHotspots(hs.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse-glow" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(32, 161, 208, 0.2)' }} />
      </div>
    );
  }

  const trendData = {
    labels: trends.map(t => t.period),
    datasets: [
      {
        label: 'Sightings',
        data: trends.map(t => t.totalSightings),
        borderColor: '#20A1D0',
        backgroundColor: 'rgba(32, 161, 208, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#20A1D0',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Unique Species',
        data: trends.map(t => t.uniqueSpecies),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#F59E0B',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const categoryData = health?.categoryBreakdown ? {
    labels: health.categoryBreakdown.map(c => c.category),
    datasets: [{
      data: health.categoryBreakdown.map(c => c.count),
      backgroundColor: ['#38BDF8', '#FBBF24', '#34D399', '#A855F7', '#FB7185', '#22D3EE', '#8B9DC3'],
      borderWidth: 0,
      spacing: 3,
    }],
  } : null;

  const speciesChartData = {
    labels: topSpecies.map(s => s.species),
    datasets: [{
      label: 'Observations',
      data: topSpecies.map(s => s.count),
      backgroundColor: topSpecies.map((_, i) =>
        [`#20A1D0`, '#F59E0B', '#10B981', '#A855F7', '#F43F5E', '#38BDF8', '#FBBF24', '#34D399', '#FB7185', '#22D3EE'][i % 10] + '40'
      ),
      borderColor: topSpecies.map((_, i) =>
        [`#20A1D0`, '#F59E0B', '#10B981', '#A855F7', '#F43F5E', '#38BDF8', '#FBBF24', '#34D399', '#FB7185', '#22D3EE'][i % 10]
      ),
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="heading-display" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
            Biodiversity <span className="neon-text">Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monthly health checks and trend analysis for urban wildlife
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          <StatsWidget label="Sightings This Month" value={health?.currentMonth?.totalSightings || 0} icon={Activity} color="var(--cyan-glow)" />
          <StatsWidget label="Species Recorded" value={health?.currentMonth?.uniqueSpecies || 0} icon={Leaf} color="var(--amber-pulse)" />
          <StatsWidget label="Biodiversity Score" value={health?.currentMonth?.biodiversityScore || 0} suffix="%" icon={TrendingUp} color="#10B981" />
          <StatsWidget label="Month-over-Month" value={health?.trend?.sightingChange > 0 ? `+${health.trend.sightingChange}` : health?.trend?.sightingChange || 0} icon={BarChart3} color={health?.trend?.sightingChange >= 0 ? '#10B981' : '#F43F5E'} />
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px', marginBottom: '32px',
        }}>
          {/* Trend Line Chart */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="heading-display" style={{ fontSize: '1.05rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--cyan-glow)" /> Monthly Trends
            </h3>
            <div style={{ height: '280px' }}>
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>

          {/* Category Doughnut */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="heading-display" style={{ fontSize: '1.05rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--amber-pulse)" /> Category Breakdown
            </h3>
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {categoryData ? (
                <Doughnut data={categoryData} options={{
                  ...chartOptions,
                  scales: undefined,
                  cutout: '60%',
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { position: 'right', labels: { color: '#8B9DC3', font: { size: 11 }, padding: 12, usePointStyle: true } },
                  },
                }} />
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No data for this month</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Species & Hotspots */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
        }}>
          {/* Top Species Bar */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="heading-display" style={{ fontSize: '1.05rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} color="#FBBF24" /> Top Observed Species
            </h3>
            <div style={{ height: '300px' }}>
              <Bar data={speciesChartData} options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: { ...chartOptions.plugins, legend: { display: false } },
              }} />
            </div>
          </div>

          {/* Hotspots */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="heading-display" style={{ fontSize: '1.05rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#10B981" /> Neighborhood Hotspots
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hotspots.length > 0 ? hotspots.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '10px',
                  background: 'rgba(32, 161, 208, 0.04)',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: `rgba(16, 185, 129, ${0.15 + (1 - i / 10) * 0.15})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: '#34D399',
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.neighborhood}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {h.count} sightings · {h.speciesCount} species
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(32, 161, 208, 0.1)', padding: '4px 10px',
                    borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--cyan-glow)',
                  }}>
                    {h.count}
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No hotspot data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
