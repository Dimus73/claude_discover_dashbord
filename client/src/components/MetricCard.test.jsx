import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  it('показывает ... когда value равен null', () => {
    render(<MetricCard title="CPU" value={null} unit="%" />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('показывает ... когда value равен undefined', () => {
    render(<MetricCard title="CPU" unit="%" />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('показывает числовое значение когда оно передано', () => {
    render(<MetricCard title="CPU" value={42.5} unit="%" />);
    expect(screen.getByText('42.5')).toBeInTheDocument();
  });

  it('показывает unit рядом со значением', () => {
    render(<MetricCard title="CPU" value={42.5} unit="%" />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('не показывает unit если он не передан', () => {
    render(<MetricCard title="CPU" value={42.5} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('показывает title', () => {
    render(<MetricCard title="CPU" value={42.5} unit="%" />);
    expect(screen.getByText('CPU')).toBeInTheDocument();
  });
});
