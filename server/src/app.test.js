const request = require('supertest');
const app = require('./app');

describe('GET /api/health', () => {
  it('возвращает статус 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('возвращает status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.status).toBe('ok');
  });

  it('возвращает поле timestamp в формате ISO', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(() => new Date(res.body.timestamp)).not.toThrow();
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it('возвращает поле uptime числового типа', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('GET /api/metrics', () => {
  it('возвращает статус 200', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
  });

  it('содержит поле cpu в диапазоне 0–100', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body).toHaveProperty('cpu');
    expect(typeof res.body.cpu).toBe('number');
    expect(res.body.cpu).toBeGreaterThanOrEqual(0);
    expect(res.body.cpu).toBeLessThanOrEqual(100);
  });

  it('содержит поле memory больше 0', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body).toHaveProperty('memory');
    expect(typeof res.body.memory).toBe('number');
    expect(res.body.memory).toBeGreaterThan(0);
  });

  it('содержит поле uptime', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('содержит поле requests', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body).toHaveProperty('requests');
    expect(typeof res.body.requests).toBe('number');
  });

  it('содержит поле time в формате HH:MM:SS', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.body).toHaveProperty('time');
    expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe('GET /api/metrics/history', () => {
  it('возвращает статус 200', async () => {
    const res = await request(app).get('/api/metrics/history');
    expect(res.status).toBe(200);
  });

  it('возвращает массив', async () => {
    const res = await request(app).get('/api/metrics/history');
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/unknown', () => {
  it('возвращает 404 для несуществующего маршрута', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
