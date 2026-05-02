const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const { collectMetrics, metricsHistory, resetRequestsPerMin, HISTORY_LIMIT } = require('./metrics');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(message) {
  const json = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(json);
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'metrics', data: collectMetrics() }));
  ws.send(JSON.stringify({ type: 'history', data: metricsHistory }));
});

setInterval(() => resetRequestsPerMin(), 60_000);

setInterval(() => {
  const snapshot = collectMetrics();
  metricsHistory.push(snapshot);
  if (metricsHistory.length > HISTORY_LIMIT) metricsHistory.shift();
  broadcast({ type: 'metrics', data: snapshot });
  broadcast({ type: 'history', data: metricsHistory });
}, 3_000);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
