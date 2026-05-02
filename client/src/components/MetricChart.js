import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function MetricChart({
  title, data, dataKey, label, color,
  unit = '', tooltipSuffix, domain, yAxisWidth = 45,
}) {
  const suffix = tooltipSuffix !== undefined ? tooltipSuffix : unit;

  const computedDomain = domain ?? (() => {
    const max = data.length ? Math.max(...data.map((d) => d[dataKey] ?? 0)) : 0;
    return [0, Math.ceil(max * 1.1) || 10];
  })();

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>{title}</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis domain={computedDomain} unit={unit} tick={{ fontSize: 11 }} width={yAxisWidth} />
          <Tooltip formatter={(v) => [`${v}${suffix}`, label]} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '20px 24px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    marginTop: 24,
  },
  title: {
    fontSize: 13,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
};
