import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CpuChart from './CpuChart';

jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
  };
});

describe('CpuChart', () => {
  it('рендерится без ошибок', () => {
    render(<CpuChart data={[]} />);
  });

  it('показывает заголовок "CPU History"', () => {
    render(<CpuChart data={[]} />);
    expect(screen.getByText('CPU History')).toBeInTheDocument();
  });
});
