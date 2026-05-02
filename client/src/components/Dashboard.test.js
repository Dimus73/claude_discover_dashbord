import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

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

const mockMetrics = {
  time: '12:00:00',
  cpu: 55.3,
  memory: 8192,
  uptime: 100,
  requests: 10,
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Dashboard', () => {
  it('в начале показывает карточки с ... (данные ещё не пришли)', () => {
    global.fetch = jest.fn(() => new Promise(() => {})); // никогда не резолвится

    render(<Dashboard />);

    const loadingElements = screen.getAllByText('...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('после успешного fetch показывает данные метрик', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMetrics,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('55.3')).toBeInTheDocument();
    });

    expect(screen.getByText('8192')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('при ошибке fetch показывает сообщение об ошибке "Ошибка:"', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ошибка:/)).toBeInTheDocument();
    });
  });
});
