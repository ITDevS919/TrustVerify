/**
 * Load Test Target Configuration
 * Ensures p95 < 300ms performance target
 */

import { monitoringService } from '../../services/monitoring-service';

export interface LoadTestConfig {
  targetRPS: number; // Requests per second
  duration: number; // Duration in seconds
  rampUp: number; // Ramp up time in seconds
  p95Target: number; // Target p95 in milliseconds (300ms)
  p99Target: number; // Target p99 in milliseconds
}

export const DEFAULT_LOAD_TEST_CONFIG: LoadTestConfig = {
  targetRPS: 100,
  duration: 300, // 5 minutes
  rampUp: 60, // 1 minute
  p95Target: 300, // 300ms target
  p99Target: 500, // 500ms target
};

export class LoadTestValidator {
  /**
   * Validate that p95 response time meets target
   */
  static validatePerformance(metrics: any): {
    passed: boolean;
    p95: number;
    target: number;
    message: string;
  } {
    const p95 = metrics.p95 || 0;
    const target = DEFAULT_LOAD_TEST_CONFIG.p95Target;
    const passed = p95 < target;

    return {
      passed,
      p95,
      target,
      message: passed
        ? `✅ Performance target met: p95=${p95}ms < ${target}ms`
        : `❌ Performance target failed: p95=${p95}ms >= ${target}ms`,
    };
  }

  /**
   * Get current performance metrics
   */
  static getCurrentMetrics(endpoint: string, method: string = 'GET'): any {
    return monitoringService.getREDMetrics(endpoint, method, 60);
  }
}

