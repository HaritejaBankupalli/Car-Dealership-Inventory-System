const request = require('supertest');
const { resetDatabase } = require('./testUtils');
const app = require('../src/app');

let customerToken;
let adminToken;
let vehicleId;

async function registerAndLogin(app, { name, email, password, role }) {
  await request(app).post('/api/auth/register').send({ name, email, password, role });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

beforeEach(async () => {
  resetDatabase();
  customerToken = await registerAndLogin(app, {
    name: 'Jane Customer',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  });
  adminToken = await registerAndLogin(app, {
    name: 'Boss Admin',
    email: 'boss@example.com',
    password: 'password123',
    role: 'admin',
  });

  const vRes = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      make: 'Porsche',
      model: '911 Carrera',
      category: 'Coupe',
      price: 114000,
      quantity: 3,
      year: 2024,
    });
  vehicleId = vRes.body.vehicle.id;
});

describe('Purchase History API', () => {
  it('rejects unauthenticated requests to /api/purchases/my', async () => {
    const res = await request(app).get('/api/purchases/my');
    expect(res.status).toBe(401);
  });

  it('rejects non-admin access to /api/purchases/all with 403', async () => {
    const res = await request(app)
      .get('/api/purchases/all')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('records purchase transaction and allows customer to view personal history', async () => {
    // Perform purchase
    const pRes = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 1 });
    expect(pRes.status).toBe(200);

    // Fetch personal purchase history
    const myRes = await request(app)
      .get('/api/purchases/my')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(myRes.status).toBe(200);
    expect(myRes.body.purchases.length).toBe(1);
    expect(myRes.body.purchases[0].make).toBe('Porsche');
    expect(myRes.body.purchases[0].model).toBe('911 Carrera');
    expect(myRes.body.purchases[0].total_price).toBe(114000);
  });

  it('allows admin to view all sales records across the dealership with summary stats', async () => {
    // Perform purchase by customer
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 2 });

    // Fetch all sales ledger as admin
    const allRes = await request(app)
      .get('/api/purchases/all')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(allRes.status).toBe(200);
    expect(allRes.body.summary.totalOrders).toBe(1);
    expect(allRes.body.summary.totalUnitsSold).toBe(2);
    expect(allRes.body.summary.totalRevenue).toBe(228000);
    expect(allRes.body.purchases[0].user_name).toBe('Jane Customer');
    expect(allRes.body.purchases[0].user_email).toBe('jane@example.com');
  });
});
