const request = require('supertest');
const app = require('../app');
const db = require('./db');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn(() => ({
     customers: {
        create: jest.fn(() => Promise.resolve({ id: 'cus_test123' }))
     }
  }));
});

// Jest hook: runs before all tests
beforeAll(async () => await db.connect());

// Jest hook: runs after each test
afterEach(async () => await db.clear());

// Jest hook: runs after all tests
afterAll(async () => await db.close());

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'Buyer',
      username: 'testbuyer',
      email: 'buyer@example.com',
      phoneNumber: '1234567890',
      password: 'password123',
    });
    // If Stripe fails (due to mock missing), we might get 500, lets ensure stripe mock is present or handled
    // If controllers catch block is good, it should work.
    // NOTE: This test might fail if Stripe API call attempts to run without network or mock.
    // Ideally we mock stripe in this test file too if it's not global.
    // For now assuming existing flow.
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toEqual('buyer');
  });

  it('should login an existing user', async () => {
    // First create a user
    await request(app).post('/api/auth/signup').send({
      firstName: 'Login',
      lastName: 'User',
      username: 'loginuser',
      phoneNumber: '5555555555',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid password', async () => {
    await request(app).post('/api/auth/signup').send({
      firstName: 'Protect',
      lastName: 'User',
      username: 'protectuser',
      phoneNumber: '9999999999',
      email: 'protect@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'protect@example.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toEqual(401);
  });
});
