const request = require('supertest');
const { resetDatabase } = require('./testUtils');
const app = require('../src/app');

beforeEach(() => {
  resetDatabase();
});

describe('POST /api/auth/register', () => {
  it('registers a new customer user and returns 201', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com', role: 'customer' });
    expect(res.body.user.password).toBeUndefined();
  });

  it('registers an admin user when role is explicitly admin', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'secret123',
      role: 'admin',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('admin');
  });

  it('rejects registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'no-name@example.com' });
    expect(res.status).toBe(400);
  });

  it('rejects a password shorter than 6 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Short Pass',
      email: 'short@example.com',
      password: '123',
    });
    expect(res.status).toBe(400);
  });

  it('rejects duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'First',
      email: 'dupe@example.com',
      password: 'secret123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Second',
      email: 'dupe@example.com',
      password: 'secret123',
    });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'mypassword',
    });
  });

  it('logs in with correct credentials and returns a JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'mypassword',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@example.com');
  });

  it('rejects an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('rejects a login for a non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'whatever',
    });
    expect(res.status).toBe(401);
  });
});
