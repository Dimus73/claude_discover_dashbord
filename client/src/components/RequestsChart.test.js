import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestsChart from './RequestsChart';

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

describe('RequestsChart', () => {
  it('рендерится без ошибок', () => {
    render(<RequestsChart data={[]} />);
  });

  it('показывает заголовок "Requests History"', () => {
    render(<RequestsChart data={[]} />);
    expect(screen.getByText('Requests History')).toBeInTheDocument();
  });
});
