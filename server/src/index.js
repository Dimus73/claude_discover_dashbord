const express = require('express');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

const HISTORY_LIMIT = 20;
const metricsHistory = [];

let requestCount = 0;
let requestsPerMin = 0;

setInterval(() => {
  requestsPerMin = requestCount;
  requestCount = 0;
}, 60_000);

function collectMetrics() {
  const loadAvg = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  const cpu = Math.round(Math.min(100, (loadAvg / cpuCount) * 100) * 10) / 10;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memory = Math.round((totalMem - freeMem) / 1024 / 1024);

  const now = new Date();
  const time = now.toTimeString().slice(0, 8); // HH:MM:SS

  return { time, cpu, memory, uptime: Math.round(process.uptime()), requests: requestsPerMin };
}

// Snapshot каждые 3 секунды — синхронно с клиентским поллингом
setInterval(() => {
  const snapshot = collectMetrics();
  metricsHistory.push(snapshot);
  if (metricsHistory.length > HISTORY_LIMIT) metricsHistory.shift();
}, 3_000);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  requestCount++;
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
