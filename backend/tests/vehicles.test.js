const request = require('supertest');
const { resetDatabase } = require('./testUtils');
const app = require('../src/app');

let customerToken;
let adminToken;

async function registerAndLogin(app, { name, email, password, role }) {
  await request(app).post('/api/auth/register').send({ name, email, password, role });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

beforeEach(async () => {
  resetDatabase();
  customerToken = await registerAndLogin(app, {
    name: 'Customer',
    email: 'customer@example.com',
    password: 'password1',
    role: 'customer',
  });
  adminToken = await registerAndLogin(app, {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password1',
    role: 'admin',
  });
});

function sampleVehicle(overrides = {}) {
  return {
    make: 'Toyota',
    model: 'Corolla',
    category: 'Sedan',
    price: 22000,
    quantity: 5,
    year: 2023,
    ...overrides,
  };
}

describe('Vehicle routes require authentication', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
  });

  it('rejects requests with an invalid token', async () => {
    const res = await request(app).get('/api/vehicles').set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/vehicles', () => {
  it('allows an authenticated user to add a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle());

    expect(res.status).toBe(201);
    expect(res.body.vehicle).toMatchObject({ make: 'Toyota', model: 'Corolla', quantity: 5 });
  });

  it('rejects a vehicle payload missing required fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ make: 'Toyota' });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects a negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ price: -100 }));

    expect(res.status).toBe(400);
  });
});

describe('GET /api/vehicles', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toEqual([]);
  });

  it('returns all created vehicles', async () => {
    await request(app).post('/api/vehicles').set('Authorization', `Bearer ${customerToken}`).send(sampleVehicle());
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ make: 'Honda', model: 'Civic' }));

    const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });
});

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await request(app).post('/api/vehicles').set('Authorization', `Bearer ${customerToken}`).send(sampleVehicle());
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 19000 }));
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ make: 'Ford', model: 'Explorer', category: 'SUV', price: 35000 }));
  });

  it('filters by make', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=honda')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.count).toBe(1);
    expect(res.body.vehicles[0].make).toBe('Honda');
  });

  it('filters by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.count).toBe(1);
    expect(res.body.vehicles[0].model).toBe('Explorer');
  });

  it('filters by price range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=20000&maxPrice=40000')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.body.count).toBe(2);
  });
});

describe('PUT /api/vehicles/:id', () => {
  it('updates a vehicle successfully', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle());
    const id = create.body.vehicle.id;

    const res = await request(app)
      .put(`/api/vehicles/${id}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ price: 21000 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.price).toBe(21000);
  });

  it('returns 404 for a non-existent vehicle', async () => {
    const res = await request(app)
      .put('/api/vehicles/9999')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ price: 21000 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  it('rejects deletion from a non-admin user', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle());
    const id = create.body.vehicle.id;

    const res = await request(app)
      .delete(`/api/vehicles/${id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin to delete a vehicle', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle());
    const id = create.body.vehicle.id;

    const res = await request(app)
      .delete(`/api/vehicles/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/vehicles/${id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(getRes.status).toBe(404);
  });
});

describe('POST /api/vehicles/:id/purchase', () => {
  it('decreases quantity on purchase', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ quantity: 3 }));
    const id = create.body.vehicle.id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(2);
  });

  it('rejects a purchase that exceeds available stock', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ quantity: 1 }));
    const id = create.body.vehicle.id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  it('rejects restock from a non-admin user', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ quantity: 2 }));
    const id = create.body.vehicle.id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(403);
  });

  it('allows an admin to restock a vehicle', async () => {
    const create = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(sampleVehicle({ quantity: 2 }));
    const id = create.body.vehicle.id;

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 8 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(10);
  });
});
