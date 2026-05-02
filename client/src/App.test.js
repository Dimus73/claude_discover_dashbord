import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

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

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {})); // никогда не резолвится
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('App', () => {
  it('рендерит заголовок "Monitor Dashboard"', () => {
    render(<App />);
    expect(screen.getByText('Monitor Dashboard')).toBeInTheDocument();
  });
});
