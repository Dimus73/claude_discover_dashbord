const os = require('os');

const HISTORY_LIMIT = 20;
const metricsHistory = [];

let requestCount = 0;
let requestsPerMin = 0;

function collectMetrics() {
  const loadAvg = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  const cpu = Math.round(Math.min(100, (loadAvg / cpuCount) * 100) * 10) / 10;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memory = Math.round((totalMem - freeMem) / 1024 / 1024);

  const now = new Date();
  const time = now.toTimeString().slice(0, 8);

  return { time, cpu, memory, uptime: Math.round(process.uptime()), requests: requestsPerMin };
}

function incrementRequestCount() {
  requestCount++;
}

function resetRequestsPerMin() {
  requestsPerMin = requestCount;
  requestCount = 0;
}

module.exports = { collectMetrics, metricsHistory, incrementRequestCount, resetRequestsPerMin, HISTORY_LIMIT };
