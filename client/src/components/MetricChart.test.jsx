import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricChart from './MetricChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe('MetricChart', () => {
  it('рендерится без ошибок с пустым массивом data', () => {
    render(<MetricChart title="CPU History" data={[]} dataKey="cpu" label="CPU" color="#4f8ef7" />);
    expect(screen.getByText('CPU History')).toBeInTheDocument();
  });

  it('показывает title', () => {
    render(<MetricChart title="Memory History" data={[]} dataKey="memory" label="Memory" color="#27ae60" />);
    expect(screen.getByText('Memory History')).toBeInTheDocument();
  });

  it('рендерится с данными', () => {
    const data = [
      { time: '10:00:00', cpu: 30 },
      { time: '10:00:03', cpu: 45 },
    ];
    render(<MetricChart title="CPU History" data={data} dataKey="cpu" label="CPU" color="#4f8ef7" unit="%" domain={[0, 100]} />);
    expect(screen.getByText('CPU History')).toBeInTheDocument();
  });
});
