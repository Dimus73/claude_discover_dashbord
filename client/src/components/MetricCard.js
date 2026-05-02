import React from 'react';

export default function MetricCard({ title, value, unit }) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>{title}</div>
      <div style={styles.value}>
        {value == null ? (
          <span style={styles.loading}>...</span>
        ) : (
          <>
            {value}
            {unit && <span style={styles.unit}> {unit}</span>}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '24px 32px',
    minWidth: 180,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  value: {
    fontSize: 36,
    fontWeight: 700,
    color: '#222',
  },
  unit: {
    fontSize: 16,
    fontWeight: 400,
    color: '#555',
  },
  loading: {
    color: '#bbb',
    fontWeight: 400,
  },
};
