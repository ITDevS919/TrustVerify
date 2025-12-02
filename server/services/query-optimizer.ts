/**
 * Query Optimization Service
 * Provides utilities for optimizing database queries
 */

import { db } from '../db';
import { sql } from 'drizzle-orm';
import pino from 'pino';
import { config } from '../config';

const logger = pino({
  name: 'query-optimizer',
  level: config.LOG_LEVEL || 'info'
});

export interface QueryStats {
  query: string;
  executionTime: number;
  rowsReturned: number;
  rowsExamined?: number;
}

export interface OptimizationRecommendation {
  query: string;
  issue: string;
  recommendation: string;
  estimatedImprovement: string;
}

export class QueryOptimizer {
  /**
   * Analyze query performance
   */
  async analyzeQuery(query: string, _params?: any[]): Promise<QueryStats> {
    const startTime = Date.now();
    
    try {
      // Enable query timing
      await db.execute(sql`SET enable_seqscan = off`);
      
      // Execute EXPLAIN ANALYZE
      // Note: sql.raw() only accepts one argument (the SQL string)
      // For parameterized queries, we'd need to use sql template tag, but EXPLAIN ANALYZE
      // requires the full query string, so we construct it directly
      const explainQuery = `EXPLAIN ANALYZE ${query}`;
      const result = await db.execute(sql.raw(explainQuery));
      
      const executionTime = Date.now() - startTime;
      
      // Parse EXPLAIN output (simplified)
      const rowsReturned = this.extractRowsFromExplain(result);
      
      return {
        query,
        executionTime,
        rowsReturned,
      };
    } catch (error: any) {
      logger.error({ error, query }, 'Query analysis failed');
      throw error;
    } finally {
      // Re-enable sequential scans
      await db.execute(sql`SET enable_seqscan = on`);
    }
  }

  /**
   * Get slow queries from pg_stat_statements
   */
  async getSlowQueries(limit: number = 10): Promise<any[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          query,
          calls,
          total_exec_time,
          mean_exec_time,
          max_exec_time,
          rows
        FROM pg_stat_statements
        WHERE mean_exec_time > 100
        ORDER BY mean_exec_time DESC
        LIMIT ${limit}
      `);
      
      return result.rows || [];
    } catch (error: any) {
      // pg_stat_statements might not be enabled
      logger.warn({ error }, 'Could not fetch slow queries');
      return [];
    }
  }

  /**
   * Check if indexes are being used
   */
  async checkIndexUsage(): Promise<any[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan as index_scans,
          idx_tup_read as tuples_read,
          idx_tup_fetch as tuples_fetched
        FROM pg_stat_user_indexes
        WHERE idx_scan = 0
        ORDER BY tablename, indexname
      `);
      
      return result.rows || [];
    } catch (error: any) {
      logger.error({ error }, 'Could not check index usage');
      return [];
    }
  }

  /**
   * Get table statistics
   */
  async getTableStats(): Promise<any[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          n_live_tup as row_count,
          n_dead_tup as dead_rows,
          last_vacuum,
          last_autovacuum,
          last_analyze,
          last_autoanalyze
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
      `);
      
      return result.rows || [];
    } catch (error: any) {
      logger.error({ error }, 'Could not get table stats');
      return [];
    }
  }

  /**
   * Recommend query optimizations
   */
  async recommendOptimizations(query: string): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Check for missing WHERE clause on large tables
    if (!query.toLowerCase().includes('where') && 
        (query.toLowerCase().includes('from transactions') || 
         query.toLowerCase().includes('from messages'))) {
      recommendations.push({
        query,
        issue: 'Missing WHERE clause on large table',
        recommendation: 'Add appropriate WHERE clause to limit rows scanned',
        estimatedImprovement: '50-90%',
      });
    }
    
    // Check for missing ORDER BY index
    if (query.toLowerCase().includes('order by') && 
        !query.toLowerCase().includes('index')) {
      recommendations.push({
        query,
        issue: 'ORDER BY without index',
        recommendation: 'Add index on ORDER BY columns',
        estimatedImprovement: '30-70%',
      });
    }
    
    // Check for SELECT *
    if (query.toLowerCase().includes('select *')) {
      recommendations.push({
        query,
        issue: 'SELECT * retrieves unnecessary columns',
        recommendation: 'Select only required columns',
        estimatedImprovement: '10-30%',
      });
    }
    
    return recommendations;
  }

  /**
   * Extract row count from EXPLAIN output
   */
  private extractRowsFromExplain(result: any): number {
    // Simplified extraction - in production, parse EXPLAIN output properly
    if (result.rows && result.rows.length > 0) {
      const explainText = JSON.stringify(result.rows);
      const match = explainText.match(/rows=(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  }

  /**
   * Vacuum and analyze tables
   */
  async vacuumTables(tables?: string[]): Promise<void> {
    try {
      if (tables && tables.length > 0) {
        for (const table of tables) {
          await db.execute(sql.raw(`VACUUM ANALYZE ${table}`));
          logger.info({ table }, 'Table vacuumed and analyzed');
        }
      } else {
        await db.execute(sql`VACUUM ANALYZE`);
        logger.info('All tables vacuumed and analyzed');
      }
    } catch (error: any) {
      logger.error({ error }, 'Vacuum failed');
      throw error;
    }
  }

  /**
   * Get query execution plan
   */
  async getExecutionPlan(query: string, _params?: any[]): Promise<string> {
    try {
      // Note: sql.raw() only accepts one argument
      // For parameterized queries, use sql template tag or construct query with params
      const explainQuery = `EXPLAIN (FORMAT JSON) ${query}`;
      const result = await db.execute(sql.raw(explainQuery));
      
      return JSON.stringify(result.rows, null, 2);
    } catch (error: any) {
      logger.error({ error, query }, 'Could not get execution plan');
      throw error;
    }
  }
}

export const queryOptimizer = new QueryOptimizer();

