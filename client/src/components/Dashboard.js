import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import CpuChart from './CpuChart';
import MemoryChart from './MemoryChart';
import RequestsChart from './RequestsChart';

const POLL_INTERVAL = 3000;
const BASE_URL = 'http://localhost:3001';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [metricsRes, historyRes] = await Promise.all([
          fetch(`${BASE_URL}/api/metrics`),
          fetch(`${BASE_URL}/api/metrics/history`),
        ]);
        if (!metricsRes.ok) throw new Error(`HTTP ${metricsRes.status}`);
        const [metricsData, historyData] = await Promise.all([
          metricsRes.json(),
          historyRes.json(),
        ]);
        if (!cancelled) {
          setMetrics(metricsData);
          setHistory(historyData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    fetchAll();
    const timer = setInterval(fetchAll, POLL_INTERVAL);
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
      <CpuChart data={history} />
      <MemoryChart data={history} />
      <RequestsChart data={history} />
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
