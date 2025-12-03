/**
 * User Repository
 * Implements user-specific data access operations
 */

import { BaseRepository } from './base-repository';
import { users, type User, type InsertUser } from '../shared/schema';
import { db } from '../db';
import { eq, ilike, or } from 'drizzle-orm';

export class UserRepository extends BaseRepository<User, InsertUser, Partial<InsertUser>> {
  protected table = users;
  protected primaryKey = 'id';

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      
      return result || null;
    } catch (error) {
      throw this.handleError(error, 'findByUsername', { username });
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      return result || null;
    } catch (error) {
      throw this.handleError(error, 'findByEmail', { email });
    }
  }

  /**
   * Find user by Google ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1);
      
      return result || null;
    } catch (error) {
      throw this.handleError(error, 'findByGoogleId', { googleId });
    }
  }

  /**
   * Update trust score
   */
  async updateTrustScore(id: number, score: string): Promise<User | null> {
    return this.update(id, { trustScore: score } as any);
  }

  /**
   * Update verification level
   */
  async updateVerificationLevel(id: number, level: string): Promise<User | null> {
    return this.update(id, { verificationLevel: level } as any);
  }

  /**
   * Update password
   */
  async updatePassword(id: number, hashedPassword: string): Promise<User | null> {
    return this.update(id, { password: hashedPassword } as any);
  }

  /**
   * Search users
   */
  async search(query: string, limit: number = 20): Promise<User[]> {
    try {
      const searchTerm = `%${query}%`;
      const results = await db
        .select()
        .from(users)
        .where(
          or(
            ilike(users.username, searchTerm),
            ilike(users.email, searchTerm),
            ilike(users.firstName, searchTerm),
            ilike(users.lastName, searchTerm)
          )
        )
        .limit(limit);
      
      return results;
    } catch (error) {
      throw this.handleError(error, 'search', { query, limit });
    }
  }
}

// Singleton instance
export const userRepository = new UserRepository();

