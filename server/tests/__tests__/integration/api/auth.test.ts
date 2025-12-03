/**
 * Integration Tests for Authentication API
 */

import request from 'supertest';
import express from 'express';
import { setupAuth } from '../../../../auth';
import { registerRoutes } from '../../../../routes';

describe('Authentication API Integration Tests', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    setupAuth(app as any);
    server = await registerRoutes(app as any);
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      // Use shorter username to ensure it fits validation (3-30 chars)
      // Date.now() is 13 digits, so we need to keep username part short
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits
      const userData = {
        username: `tu${timestamp}`, // "tu" + 8 digits = 10 chars, well within 3-30 limit
        email: `test_${timestamp}@example.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData);

      // Log the response if it's not 201 to debug
      if (response.status !== 201) {
        console.log('Registration failed:', response.status, response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/login', () => {
    let testUser: any;

    beforeAll(async () => {
      // Create a test user
      // Use shorter username to ensure it fits validation (3-30 chars)
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits
      const userData = {
        username: `tu${timestamp}`, // "tu" + 8 digits = 10 chars
        email: `test_${timestamp}@example.com`,
        password: 'TestPassword123!',
      };

      const registerResponse = await request(app)
        .post('/api/register')
        .send(userData);

      // Log if registration failed
      if (registerResponse.status !== 201) {
        console.log('Test user registration failed:', registerResponse.status, registerResponse.body);
      }

      testUser = registerResponse.body;
      
      // Ensure testUser was created
      if (!testUser || !testUser.id) {
        throw new Error(`Failed to create test user: ${JSON.stringify(registerResponse.body)}`);
      }
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: testUser.username,
          password: 'TestPassword123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: testUser.username,
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/logout')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/user')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});

