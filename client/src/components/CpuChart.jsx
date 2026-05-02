import React from 'react';
import MetricChart from './MetricChart';

export default function CpuChart({ data }) {
  return (
    <MetricChart
      title="CPU History"
      data={data}
      dataKey="cpu"
      label="CPU"
      color="#4f8ef7"
      unit="%"
      domain={[0, 100]}
    />
  );
}
