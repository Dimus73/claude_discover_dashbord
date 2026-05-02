import React from 'react';
import { render, screen } from '@testing-library/react';
import MemoryChart from './MemoryChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

describe('MemoryChart', () => {
  it('рендерится без ошибок', () => {
    render(<MemoryChart data={[]} />);
  });

  it('показывает заголовок "Memory History"', () => {
    render(<MemoryChart data={[]} />);
    expect(screen.getByText('Memory History')).toBeInTheDocument();
  });
});
