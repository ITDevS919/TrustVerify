/**
 * Integration Tests for Transactions API
 */

import request from 'supertest';
import express from 'express';
import { setupAuth } from '../../../../auth';
import { registerRoutes } from '../../../../routes';
import { describe } from 'node:test';

describe('Transactions API Integration Tests', () => {
  let app: express.Application;
  let server: any;
  let authCookie: string;
  let testUserId: number;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    setupAuth(app as any);
    server = await registerRoutes(app as any);

    // Create test user and login
    const timestamp = Date.now();
    const registerResponse = await request(app)
      .post('/api/register')
      .send({
        username: `testuser_${timestamp}`,
        email: `test_${timestamp}@example.com`,
        password: 'TestPassword123!',
      });

    testUserId = registerResponse.body.id;

    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        username: `testuser_${timestamp}`,
        password: 'TestPassword123!',
      });

    authCookie = loginResponse.headers['set-cookie']?.[0] || '';
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        title: 'Test Transaction',
        description: 'Test transaction description',
        amount: '100.00',
        currency: 'USD',
        sellerId: testUserId,
      };

      const response = await request(app)
        .post('/api/transactions')
        .set('Cookie', authCookie)
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(transactionData.title);
      expect(response.body.amount).toBe(transactionData.amount);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send({
          title: 'Test',
          amount: '100.00',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Cookie', authCookie)
        .send({
          title: 'Test',
          // Missing amount
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/transactions', () => {
    it('should get user transactions', async () => {
      const response = await request(app)
        .get('/api/transactions?page=1&limit=10')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body).toHaveProperty('transactions');
      expect(Array.isArray(response.body.transactions)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});

