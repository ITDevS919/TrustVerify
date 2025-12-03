/**
 * Unit Tests for Base Repository
 */

import { BaseRepository } from '../../../../repositories/base-repository';
import { db } from '../../../../db';
import { users } from '../../../../shared/schema';
import { eq } from 'drizzle-orm';

// Mock the database
jest.mock('../../../../db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    execute: jest.fn(),
  },
}));

class TestRepository extends BaseRepository<any, any, any> {
  protected table = users;
  protected primaryKey = 'id';
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find a record by ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockUser]),
      };
      
      (db.select as jest.Mock).mockReturnValue(mockQuery);

      const result = await repository.findById(1);

      expect(result).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return null if record not found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      
      (db.select as jest.Mock).mockReturnValue(mockQuery);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      // Mock the cache service to return null (cache miss) and then throw on fetcher
      const mockCache = require('../../../../services/read-cache');
      const originalGetOrSet = mockCache.readCache.getOrSet;
      
      // Mock cache to call fetcher which will throw
      mockCache.readCache.getOrSet = jest.fn().mockImplementation(async ({ fetcher }) => {
        // Simulate cache miss, then call fetcher which should throw
        return fetcher();
      });
      
      // Mock cache service to return null (cache miss)
      const cacheService = require('../../../../services/cache-service');
      const originalGet = cacheService.cacheService.get;
      cacheService.cacheService.get = jest.fn().mockResolvedValue(null);
      
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      
      (db.select as jest.Mock).mockReturnValue(mockQuery);

      await expect(repository.findById(1)).rejects.toThrow('Repository findById failed');
      
      // Restore originals
      mockCache.readCache.getOrSet = originalGetOrSet;
      cacheService.cacheService.get = originalGet;
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockUser]),
      };
      
      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const result = await repository.create({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const mockUser = { id: 1, email: 'updated@example.com' };
      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockUser]),
      };
      
      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const result = await repository.update(1, { email: 'updated@example.com' });

      expect(result).toEqual(mockUser);
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mockDelete = {
        where: jest.fn().mockResolvedValue({ rowCount: 1 }),
      };
      
      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      const result = await repository.delete(1);

      expect(result).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });

    it('should return false if record not found', async () => {
      const mockDelete = {
        where: jest.fn().mockResolvedValue({ rowCount: 0 }),
      };
      
      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      const result = await repository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true if record exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser.id as any);

      const result = await repository.exists(1);

      expect(result).toBe(true);
    });

    it('should return false if record does not exist', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      const result = await repository.exists(999);

      expect(result).toBe(false);
    });
  });
});

