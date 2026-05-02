import React, { useState, useEffect, useRef } from 'react';
import MetricCard from './MetricCard';
import CpuChart from './CpuChart';
import MemoryChart from './MemoryChart';
import RequestsChart from './RequestsChart';

const WS_URL = 'ws://localhost:3001';
const RECONNECT_DELAY = 3000;

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    let ws;

    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'metrics') setMetrics(msg.data);
        if (msg.type === 'history') setHistory(msg.data);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      ws.close();
    };
  }, []);

  const cards = [
    { id: 'cpu',      title: 'CPU',      value: metrics?.cpu,      unit: '%'       },
    { id: 'memory',   title: 'Memory',   value: metrics?.memory,   unit: 'MB'      },
    { id: 'uptime',   title: 'Uptime',   value: metrics?.uptime,   unit: 'sec'     },
    { id: 'requests', title: 'Requests', value: metrics?.requests, unit: 'req/min' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Monitor Dashboard</h1>
        <span style={connected ? styles.live : styles.reconnecting}>
          {connected ? '● Live' : '○ Reconnecting...'}
        </span>
      </div>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  heading: {
    margin: 0,
    fontSize: 24,
    color: '#333',
  },
  live: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: 600,
  },
  reconnecting: {
    fontSize: 13,
    color: '#e67e22',
    fontWeight: 600,
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
