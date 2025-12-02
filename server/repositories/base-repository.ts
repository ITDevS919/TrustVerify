/**
 * Base Repository
 * Provides common CRUD operations with query optimization
 */

import { db } from '../db';
import { eq, sql, desc, asc } from 'drizzle-orm';
import { readCache } from '../services/read-cache';
import pino from 'pino';
import { config } from '../config';

const logger = pino({
  name: 'base-repository',
  level: config.LOG_LEVEL || 'info'
});

export interface FindOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export abstract class BaseRepository<T, TInsert, TUpdate> {
  protected abstract table: any;
  protected abstract primaryKey: string;

  /**
   * Find record by ID (with caching)
   */
  async findById(id: number): Promise<T | null> {
    return readCache.getOrSet({
      key: `${this.table.name}:id:${id}`,
      ttl: 300, // 5 minutes
      fetcher: async () => {
        try {
          const result = await db
            .select()
            .from(this.table)
            .where(eq(this.table[this.primaryKey], id))
            .limit(1);

          return (result[0] as T) || null;
        } catch (error) {
          throw this.handleError(error, 'findById', { id });
        }
      },
    });
  }

  /**
   * Find all records with pagination and caching
   */
  async findAll(options: FindOptions = {}): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }> {
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    // Generate cache key based on options
    const cacheKey = `${this.table.name}:all:${JSON.stringify(options)}`;

    return readCache.getOrSet({
      key: cacheKey,
      ttl: 60, // 1 minute for list queries
      fetcher: async () => {
        try {
          // Get total count
          const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(this.table);

          const total = Number(countResult[0]?.count || 0);

          // Get paginated data
          let query = db.select().from(this.table);
          
          // Apply ordering if specified
          if (options.orderBy && this.table[options.orderBy]) {
            const orderColumn = this.table[options.orderBy];
            if (options.orderDirection === 'desc') {
              query = query.orderBy(desc(orderColumn)) as any;
            } else {
              query = query.orderBy(asc(orderColumn)) as any;
            }
          }

          const data = await (query as any).limit(limit).offset(offset);

          return {
            data: data as T[],
            total,
            page,
            limit,
          };
        } catch (error) {
          throw this.handleError(error, 'findAll', options);
        }
      },
    });
  }

  /**
   * Create new record
   */
  async create(data: TInsert): Promise<T> {
    try {
      const result = await db
        .insert(this.table)
        .values(data as any)
        .returning();
      
      if (Array.isArray(result) && result.length > 0) {
        const created = result[0] as T;
        
        // Invalidate cache
        await readCache.invalidate(`${this.table.name}:*`);
        
        return created;
      }
      throw new Error('Failed to create record');
    } catch (error) {
      throw this.handleError(error, 'create', data);
    }
  }

  /**
   * Update record
   */
  async update(id: number, updates: TUpdate): Promise<T | null> {
    try {
      const result = await db
        .update(this.table)
        .set(updates as any)
        .where(eq(this.table[this.primaryKey], id))
        .returning();
      
      if (Array.isArray(result) && result.length > 0) {
        const updated = result[0] as T;
        
        // Invalidate specific record cache
        await readCache.invalidate(`${this.table.name}:id:${id}`);
        await readCache.invalidate(`${this.table.name}:*`);
        
        return updated;
      }
      return null;
    } catch (error) {
      throw this.handleError(error, 'update', { id, updates });
    }
  }

  /**
   * Delete record
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(this.table)
        .where(eq(this.table[this.primaryKey], id));
      
      // Invalidate cache
      await readCache.invalidate(`${this.table.name}:id:${id}`);
      await readCache.invalidate(`${this.table.name}:*`);
      
      // Drizzle returns different types depending on the database driver
      // Check if result has rows property (Neon) or rowCount (pg)
      if (result && typeof result === 'object') {
        if ('rowCount' in result) {
          return ((result as any).rowCount || 0) > 0;
        }
        if ('rows' in result) {
          return Array.isArray((result as any).rows) && (result as any).rows.length > 0;
        }
      }
      return false;
    } catch (error) {
      throw this.handleError(error, 'delete', { id });
    }
  }

  /**
   * Check if record exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.findById(id);
      return result !== null;
    } catch (error) {
      throw this.handleError(error, 'exists', { id });
    }
  }

  /**
   * Handle errors consistently
   */
  protected handleError(error: any, operation: string, context: any): Error {
    logger.error({ error, operation, context }, 'Repository operation failed');
    
    if (error instanceof Error) {
      error.message = `Repository ${operation} failed: ${error.message}`;
      return error;
    }
    
    return new Error(`Repository ${operation} failed: ${String(error)}`);
  }
}
