import React from 'react';
import { render, screen } from '@testing-library/react';
import CpuChart from './CpuChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe('CpuChart', () => {
  it('рендерится без ошибок', () => {
    render(<CpuChart data={[]} />);
  });

  it('показывает заголовок "CPU History"', () => {
    render(<CpuChart data={[]} />);
    expect(screen.getByText('CPU History')).toBeInTheDocument();
  });
});
