import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Dashboard from './Dashboard';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

const mockMetrics = {
  time: '12:00:00',
  cpu: 55.3,
  memory: 8192,
  uptime: 100,
  requests: 10,
};

let mockWs;

class MockWebSocket {
  constructor() {
    this.readyState = MockWebSocket.CONNECTING;
    mockWs = this;
  }
  send() {}
  close() { this.onclose && this.onclose({}); }
}
MockWebSocket.OPEN = 1;
MockWebSocket.CONNECTING = 0;

beforeEach(() => {
  global.WebSocket = MockWebSocket;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Dashboard', () => {
  it('в начале показывает карточки с ... (данные ещё не пришли)', () => {
    render(<Dashboard />);
    const loadingElements = screen.getAllByText('...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('показывает индикатор Reconnecting... до подключения', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Reconnecting/)).toBeInTheDocument();
  });

  it('после успешного подключения показывает Live', () => {
    render(<Dashboard />);
    act(() => { mockWs.onopen && mockWs.onopen(); });
    expect(screen.getByText(/Live/)).toBeInTheDocument();
  });

  it('после получения type=metrics показывает данные', () => {
    render(<Dashboard />);
    act(() => {
      mockWs.onopen && mockWs.onopen();
      mockWs.onmessage && mockWs.onmessage({
        data: JSON.stringify({ type: 'metrics', data: mockMetrics }),
      });
    });
    expect(screen.getByText('55.3')).toBeInTheDocument();
    expect(screen.getByText('8192')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('при обрыве соединения показывает Reconnecting...', () => {
    render(<Dashboard />);
    act(() => {
      mockWs.onopen && mockWs.onopen();
      mockWs.onclose && mockWs.onclose({});
    });
    expect(screen.getByText(/Reconnecting/)).toBeInTheDocument();
  });
});
