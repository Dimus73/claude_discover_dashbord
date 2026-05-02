const express = require('express');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

let requestCount = 0;
let requestsPerMin = 0;

setInterval(() => {
  requestsPerMin = requestCount;
  requestCount = 0;
}, 60_000);

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
  const loadAvg = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  const cpuPercent = Math.min(100, (loadAvg / cpuCount) * 100);

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemMb = Math.round((totalMem - freeMem) / 1024 / 1024);

  res.json({
    cpu: Math.round(cpuPercent * 10) / 10,
    memory: usedMemMb,
    uptime: Math.round(process.uptime()),
    requests: requestsPerMin,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
