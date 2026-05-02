import React from 'react';
import MetricChart from './MetricChart';

export default function MemoryChart({ data }) {
  return (
    <MetricChart
      title="Memory History"
      data={data}
      dataKey="memory"
      label="Memory"
      color="#27ae60"
      unit=" MB"
      yAxisWidth={60}
    />
  );
}
