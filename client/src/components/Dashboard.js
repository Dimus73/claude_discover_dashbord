import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';

const POLL_INTERVAL = 3000;
const API_URL = 'http://localhost:3001/api/metrics';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMetrics() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMetrics(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    fetchMetrics();
    const timer = setInterval(fetchMetrics, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const cards = [
    { id: 'cpu',      title: 'CPU',      value: metrics?.cpu,      unit: '%'      },
    { id: 'memory',   title: 'Memory',   value: metrics?.memory,   unit: 'MB'     },
    { id: 'uptime',   title: 'Uptime',   value: metrics?.uptime,   unit: 'sec'    },
    { id: 'requests', title: 'Requests', value: metrics?.requests, unit: 'req/min'},
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Monitor Dashboard</h1>
      {error && <div style={styles.error}>Ошибка: {error}</div>}
      <div style={styles.grid}>
        {cards.map((c) => (
          <MetricCard key={c.id} title={c.title} value={c.value} unit={c.unit} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f9',
    padding: '40px 32px',
    fontFamily: 'system-ui, sans-serif',
  },
  heading: {
    margin: '0 0 32px',
    fontSize: 24,
    color: '#333',
  },
  grid: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
  },
  error: {
    marginBottom: 16,
    padding: '8px 12px',
    background: '#fde8e8',
    border: '1px solid #f5c6c6',
    borderRadius: 6,
    color: '#c0392b',
    fontSize: 14,
  },
};
