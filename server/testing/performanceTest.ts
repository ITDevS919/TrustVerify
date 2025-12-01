/**
 * Performance Testing Suite for TrustVerify Enterprise Platform
 * Tests load handling, response times, and scalability
 */

import { performance } from 'perf_hooks';
import http from 'http';
import https from 'https';

interface LoadTestConfig {
  baseUrl: string;
  endpoints: string[];
  concurrentUsers: number;
  requestsPerUser: number;
  rampUpTime: number; // seconds
  testDuration: number; // seconds
}

interface PerformanceMetrics {
  endpoint: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
}

export class PerformanceTester {
  private results: PerformanceMetrics[] = [];
  
  async runLoadTest(config: LoadTestConfig): Promise<PerformanceMetrics[]> {
    console.log(`\n🚀 PERFORMANCE LOAD TEST STARTING`);
    console.log(`Base URL: ${config.baseUrl}`);
    console.log(`Concurrent Users: ${config.concurrentUsers}`);
    console.log(`Requests per User: ${config.requestsPerUser}`);
    console.log(`Test Duration: ${config.testDuration}s\n`);

    const startTime = performance.now();
    const promises: Promise<PerformanceMetrics>[] = [];
    
    // Test each endpoint
    for (const endpoint of config.endpoints) {
      console.log(`📊 Testing endpoint: ${endpoint}`);
      const testPromise = this.testEndpoint(config.baseUrl + endpoint, config);
      promises.push(testPromise);
    }
    
    this.results = await Promise.all(promises);
    
    const endTime = performance.now();
    console.log(`\n✅ Load test completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
    
    this.printPerformanceReport();
    return this.results;
  }

  private async testEndpoint(url: string, config: LoadTestConfig): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {
      endpoint: url,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      errorRate: 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    const responseTimes: number[] = [];
    const startMemory = process.memoryUsage();
    const startCpu = process.cpuUsage();
    
    // Simulate concurrent users
    const userPromises: Promise<void>[] = [];
    
    for (let user = 0; user < config.concurrentUsers; user++) {
      const userPromise = this.simulateUser(url, config.requestsPerUser, responseTimes, metrics);
      userPromises.push(userPromise);
      
      // Ramp up gradually
      if (config.rampUpTime > 0) {
        await this.sleep((config.rampUpTime * 1000) / config.concurrentUsers);
      }
    }
    
    await Promise.all(userPromises);
    
    // Calculate final metrics
    if (responseTimes.length > 0) {
      metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      metrics.minResponseTime = Math.min(...responseTimes);
      metrics.maxResponseTime = Math.max(...responseTimes);
    }
    
    metrics.requestsPerSecond = metrics.totalRequests / config.testDuration;
    metrics.errorRate = (metrics.failedRequests / metrics.totalRequests) * 100;
    metrics.memoryUsage = {
      rss: process.memoryUsage().rss - startMemory.rss,
      heapTotal: process.memoryUsage().heapTotal - startMemory.heapTotal,
      heapUsed: process.memoryUsage().heapUsed - startMemory.heapUsed,
      external: process.memoryUsage().external - startMemory.external,
      arrayBuffers: process.memoryUsage().arrayBuffers - startMemory.arrayBuffers
    };
    metrics.cpuUsage = process.cpuUsage(startCpu);
    
    return metrics;
  }

  private async simulateUser(url: string, requestCount: number, responseTimes: number[], metrics: PerformanceMetrics): Promise<void> {
    for (let i = 0; i < requestCount; i++) {
      try {
        const startTime = performance.now();
        await this.makeRequest(url);
        const endTime = performance.now();
        
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        metrics.totalRequests++;
        metrics.successfulRequests++;
        
      } catch (error) {
        metrics.totalRequests++;
        metrics.failedRequests++;
      }
      
      // Small delay between requests to simulate realistic usage
      await this.sleep(Math.random() * 100);
    }
  }

  private makeRequest(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private printPerformanceReport(): void {
    console.log(`\n📈 PERFORMANCE TEST RESULTS`);
    console.log(`${'-'.repeat(80)}`);
    
    this.results.forEach(metric => {
      console.log(`\n🔗 Endpoint: ${metric.endpoint}`);
      console.log(`   Total Requests: ${metric.totalRequests}`);
      console.log(`   Success Rate: ${((metric.successfulRequests / metric.totalRequests) * 100).toFixed(2)}%`);
      console.log(`   Error Rate: ${metric.errorRate.toFixed(2)}%`);
      console.log(`   Avg Response Time: ${metric.averageResponseTime.toFixed(2)}ms`);
      console.log(`   Min Response Time: ${metric.minResponseTime.toFixed(2)}ms`);
      console.log(`   Max Response Time: ${metric.maxResponseTime.toFixed(2)}ms`);
      console.log(`   Requests/Second: ${metric.requestsPerSecond.toFixed(2)}`);
      console.log(`   Memory Delta: ${(metric.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   CPU Time: ${metric.cpuUsage.user + metric.cpuUsage.system}μs`);
    });
    
    // Overall assessment
    console.log(`\n🎯 PERFORMANCE ASSESSMENT`);
    console.log(`${'-'.repeat(40)}`);
    
    const avgResponseTime = this.results.reduce((sum, m) => sum + m.averageResponseTime, 0) / this.results.length;
    const avgErrorRate = this.results.reduce((sum, m) => sum + m.errorRate, 0) / this.results.length;
    const totalRPS = this.results.reduce((sum, m) => sum + m.requestsPerSecond, 0);
    
    console.log(`Overall Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Overall Error Rate: ${avgErrorRate.toFixed(2)}%`);
    console.log(`Total Requests/Second: ${totalRPS.toFixed(2)}`);
    
    // Performance scoring
    let score = 100;
    if (avgResponseTime > 1000) score -= 30;
    else if (avgResponseTime > 500) score -= 15;
    else if (avgResponseTime > 200) score -= 5;
    
    if (avgErrorRate > 5) score -= 40;
    else if (avgErrorRate > 1) score -= 20;
    else if (avgErrorRate > 0.1) score -= 5;
    
    if (totalRPS < 10) score -= 20;
    else if (totalRPS < 50) score -= 10;
    
    console.log(`\n🏆 Performance Score: ${score}/100`);
    
    if (score >= 90) console.log(`✅ Excellent performance - enterprise ready`);
    else if (score >= 75) console.log(`🟡 Good performance - minor optimizations needed`);
    else if (score >= 60) console.log(`🟠 Fair performance - optimization required`);
    else console.log(`🔴 Poor performance - significant improvements needed`);
  }

  async runStressTest(baseUrl: string): Promise<void> {
    console.log(`\n💪 STRESS TEST STARTING`);
    console.log(`Testing system limits and breaking points\n`);
    
    const stressLevels = [
      { users: 10, duration: 30 },
      { users: 50, duration: 60 },
      { users: 100, duration: 90 },
      { users: 200, duration: 120 },
      { users: 500, duration: 180 }
    ];
    
    for (const level of stressLevels) {
      console.log(`🔥 Stress Level: ${level.users} concurrent users for ${level.duration}s`);
      
      const config: LoadTestConfig = {
        baseUrl,
        endpoints: ['/api/transactions', '/api/users/me', '/api/trust-score'],
        concurrentUsers: level.users,
        requestsPerUser: 10,
        rampUpTime: 10,
        testDuration: level.duration
      };
      
      const results = await this.runLoadTest(config);
      
      // Check if system is still responsive
      const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
      const errorRate = results.reduce((sum, r) => sum + r.errorRate, 0) / results.length;
      
      console.log(`⚡ Stress Result: ${avgResponseTime.toFixed(2)}ms avg, ${errorRate.toFixed(2)}% errors`);
      
      if (errorRate > 10) {
        console.log(`🔴 System breaking point reached at ${level.users} users`);
        break;
      }
      
      if (avgResponseTime > 5000) {
        console.log(`🟡 Performance degradation at ${level.users} users`);
      }
      
      // Cool down period
      await this.sleep(10000);
    }
  }

  async benchmarkTrustScoreEngine(baseUrl: string): Promise<void> {
    console.log(`\n🧠 TRUST SCORE ENGINE BENCHMARK`);
    console.log(`Testing ML scoring performance under load\n`);
    
    const userIds = Array.from({ length: 100 }, (_, i) => i + 1);
    const startTime = performance.now();
    let successCount = 0;
    let errorCount = 0;
    const responseTimes: number[] = [];
    
    const promises = userIds.map(async (userId) => {
      try {
        const reqStart = performance.now();
        await this.makeRequest(`${baseUrl}/api/trust-score/${userId}`);
        const reqEnd = performance.now();
        responseTimes.push(reqEnd - reqStart);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    });
    
    await Promise.all(promises);
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`📊 Trust Score Benchmark Results:`);
    console.log(`   Total Users Processed: ${userIds.length}`);
    console.log(`   Successful Calculations: ${successCount}`);
    console.log(`   Failed Calculations: ${errorCount}`);
    console.log(`   Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`   Average Time per User: ${(totalTime / userIds.length).toFixed(2)}ms`);
    console.log(`   Calculations per Second: ${(userIds.length / (totalTime / 1000)).toFixed(2)}`);
    
    if (responseTimes.length > 0) {
      console.log(`   Min Response Time: ${Math.min(...responseTimes).toFixed(2)}ms`);
      console.log(`   Max Response Time: ${Math.max(...responseTimes).toFixed(2)}ms`);
      console.log(`   Avg Response Time: ${(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)}ms`);
    }
  }
}

// Export default test configurations
export const DEFAULT_LOAD_TEST_CONFIG: LoadTestConfig = {
  baseUrl: 'http://localhost:5000',
  endpoints: [
    '/api/transactions',
    '/api/users/me',
    '/api/trust-score/1',
    '/api/industry/fintech/verify',
    '/api/industry/crypto/verify',
    '/api/enterprise/dashboard/overview',
    '/api/demo/crypto/assess-risk'
  ],
  concurrentUsers: 25,
  requestsPerUser: 10,
  rampUpTime: 5,
  testDuration: 60
};

export const performanceTester = new PerformanceTester();