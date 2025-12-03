/**
 * Integration Tests for Database Operations
 */

import { userRepository } from '../../../../repositories/user-repository';
import { db } from '../../../../db';
import { users, type User } from '../../../../shared/schema';
import { eq } from 'drizzle-orm';

describe('User Repository Integration Tests', () => {
  let testUserId: number;
  let dbAvailable = false;

  beforeAll(async () => {
    // Check if database is available
    try {
      await db.select().from(users).limit(1);
      dbAvailable = true;
      // Clean up any existing test data
      await db.delete(users).where(eq(users.email, 'test@example.com'));
    } catch (error) {
      console.warn('Database not available, skipping integration tests');
      dbAvailable = false;
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  describe('create', () => {
    it('should create a new user in database', async () => {
      if (!dbAvailable) {
        return; // Skip test if database is not available
      }
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await userRepository.create(userData);
      testUserId = user.id;

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      if (!dbAvailable) return;
      if (!testUserId) {
        const user = await userRepository.create({
          email: 'findbyid@example.com',
          username: 'findbyid',
        });
        testUserId = user.id;
      }

      const user = await userRepository.findById(testUserId);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(testUserId);
    });

    it('should return null for non-existent ID', async () => {
      if (!dbAvailable) return;
      const user = await userRepository.findById(999999);
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      if (!dbAvailable) return;
      const email = 'findbyemail@example.com';
      const created = await userRepository.create({
        email,
        username: 'findbyemail',
      });

      const user = await userRepository.findByEmail(email);

      expect(user).not.toBeNull();
      expect(user?.email).toBe(email);

      // Cleanup
      await db.delete(users).where(eq(users.id, created.id));
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      if (!dbAvailable) return;
      if (!testUserId) {
        const user = await userRepository.create({
          email: 'update@example.com',
          username: 'update',
        });
        testUserId = user.id;
      }

      const updated = await userRepository.update(testUserId, {
        firstName: 'Updated',
      });

      expect(updated).not.toBeNull();
      expect(updated?.firstName).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      if (!dbAvailable) return;
      const user = await userRepository.create({
        email: 'delete@example.com',
        username: 'delete',
      });

      const deleted = await userRepository.delete(user.id);
      expect(deleted).toBe(true);

      const found = await userRepository.findById(user.id);
      expect(found).toBeNull();
    });
  });

  describe('search', () => {
    it('should search users by query', async () => {
      if (!dbAvailable) return;
      const user = await userRepository.create({
        email: 'search@example.com',
        username: 'searchuser',
        firstName: 'Search',
        lastName: 'Test',
      });

      const results = await userRepository.search('Search');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some((u: User) => u.id === user.id)).toBe(true);

      // Cleanup
      await db.delete(users).where(eq(users.id, user.id));
    });
  });
});

