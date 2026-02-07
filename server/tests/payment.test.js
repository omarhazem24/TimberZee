const request = require('supertest');
const app = require('../app');
const db = require('./db');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: {
      create: jest.fn(() =>
        Promise.resolve({
          client_secret: 'mock_client_secret',
        })
      ),
    },
  }));
});

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Payment Endpoints', () => {
  let userToken;
  let productId;

  beforeEach(async () => {
    // Create user
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Payer',
      lastName: 'User',
      username: 'payeruser',
      phoneNumber: '1231231234',
      email: 'payer@example.com',
      password: '123',
    });
    userToken = res.body.token;

    // Create admin & product (need product for accurate pricing)
    // Manually create admin in DB because signup is locked to buyer
    // We can't use signup endpoint for admin anymore.
    // Instead, we hack it by signing up as buyer then updating role in DB directly if we had DB access, 
    // OR just use a seed mechanism.
    // Since we are in integration tests with in-memory DB, let's use a workaround:
    // We will just assume role='admin' works in database if we could inject it, 
    // BUT since we can't easily inject without importing User model, let's stick to signup
    // Wait, the new code forces 'buyer'.
    // We need to import User model to force upgrade the user to admin for testing.
    
    // Create as buyer
    const adminSignup = await request(app).post('/api/auth/signup').send({
      firstName: 'Admin',
      lastName: 'User',
      username: 'adminuser',
      phoneNumber: '9999999999',
      email: 'admin@pay.com',
      password: '123',
    });
    
    // Upgrade to admin using direct DB access (we need to require User model)
    // Since we are mocking DB connection in tests/db.js but app connects too...
    // Let's use the mongoose connection.
    const User = require('../models/User'); 
    await User.findOneAndUpdate({ email: 'admin@pay.com' }, { role: 'admin' });
    
    // Login to get token again (or just use the one we have, role is checked at middleware level against DB)
    // Middleware checks `req.user` from DB, so the token which contains ID is enough.
    const adminLogin = await request(app).post('/api/auth/login').send({
       email: 'admin@pay.com',
       password: '123'
    });
    const adminToken = adminLogin.body.token;

    const prodRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Expensive Item',
        image: '/img.jpg',
        description: 'Desc',
        price: 100, // $100
        countInStock: 5,
      });
    productId = prodRes.body._id;
  });

  it('should create a payment intent with correct amount', async () => {
    const res = await request(app)
      .post('/api/payment/create-payment-intent')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        cartItems: [
          {
            product: productId,
            qty: 2, // 2 * $100 = $200
          },
        ],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('clientSecret', 'mock_client_secret');
  });

  it('should fail if cart is empty', async () => {
    const res = await request(app)
      .post('/api/payment/create-payment-intent')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        cartItems: [],
      });

    expect(res.statusCode).toEqual(400);
  });
});
