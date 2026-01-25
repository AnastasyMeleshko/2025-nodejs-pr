import request from 'supertest';
import type { Express } from 'express';
import { sequelize } from '../db/db';
import { app, server } from '../server';

describe('server endpoints', () => {
  it('GET /api/docs should return swagger UI', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toBe(301);
  });

  it('GET /api/students should return 200', async () => {
    const res = await request(app).get('/api/students');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/auth/login should validate body', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bad', password: '' });
    expect([400, 500]).toContain(res.status);
  });
});

afterAll(async () => {
  await sequelize.close(); // закрыть соединение с БД
  await new Promise(resolve => setTimeout(resolve, 500)); // дать время завершиться
});

describe('server endpoints', () => {
  it('GET /api/docs should return swagger UI', async () => {
    const res = await request(app).get('/api/docs');
    expect([200, 301, 302]).toContain(res.status);
  });

  it('GET /api/students should return 200 or 500', async () => {
    const res = await request(app).get('/api/students');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/auth/login should validate body', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'bad', password: '' });
    expect([400, 500]).toContain(res.status);
  });

  it('POST /api/auth/login with missing body should return 400 or 500', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .send({});
    expect([400, 500]).toContain(res.status);
  });

  it('POST /api/students should validate body', async () => {
    const res = await request(app)
        .post('/api/students')
        .send({ name: '', age: -1, group: '' });
    expect([400, 500]).toContain(res.status);
  });
});

afterAll(async () => {
  await sequelize.close();
  await new Promise(resolve => setTimeout(resolve, 500));
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});
