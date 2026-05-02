import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

class MockWebSocket {
  constructor() {}
  send() {}
  close() {}
}
MockWebSocket.OPEN = 1;
MockWebSocket.CONNECTING = 0;

beforeEach(() => {
  global.WebSocket = MockWebSocket;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('рендерит заголовок "Monitor Dashboard"', () => {
    render(<App />);
    expect(screen.getByText('Monitor Dashboard')).toBeInTheDocument();
  });
});
