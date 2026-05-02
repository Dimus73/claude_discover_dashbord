const express = require('express');
const cors = require('cors');
const { collectMetrics, metricsHistory, incrementRequestCount } = require('./metrics');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  incrementRequestCount();
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/metrics', (req, res) => {
  res.json(collectMetrics());
});

app.get('/api/metrics/history', (req, res) => {
  res.json(metricsHistory);
});

module.exports = app;
