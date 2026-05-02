import React from 'react';
import MetricChart from './MetricChart';

export default function RequestsChart({ data }) {
  return (
    <MetricChart
      title="Requests History"
      data={data}
      dataKey="requests"
      label="Requests"
      color="#e67e22"
      tooltipSuffix=" req/min"
    />
  );
}
