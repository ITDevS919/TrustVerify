/**
 * Test Helper Functions
 * Common utilities for testing
 */

import { db } from '../../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface TestUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

/**
 * Create a test user
 */
export async function createTestUser(overrides?: Partial<TestUser>): Promise<TestUser> {
  const timestamp = Date.now();
  const testUser = {
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: 'TestPassword123!',
    ...overrides,
  };

  // Hash password
  const argon2 = await import('argon2');
  const hashedPassword = await argon2.hash(testUser.password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const [user] = await db
    .insert(users)
    .values({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    })
    .returning();

  return {
    id: user.id,
    username: user.username!,
    email: user.email,
    password: testUser.password,
  };
}

/**
 * Delete a test user
 */
export async function deleteTestUser(userId: number): Promise<void> {
  await db.delete(users).where(eq(users.id, userId));
}

/**
 * Clean up all test users
 */
export async function cleanupTestUsers(): Promise<void> {
  await db.delete(users).where(eq(users.email, 'test_%'));
}

/**
 * Wait for a condition
 */
export function waitFor(condition: () => boolean, timeout: number = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

