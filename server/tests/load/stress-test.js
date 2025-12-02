/**
 * Stress Test Script (2× Baseline Traffic)
 * Tests system under 2x normal load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const requestCount = new Counter('total_requests');

// Baseline: 100 RPS, Stress: 200 RPS (2× baseline)
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to baseline
    { duration: '5m', target: 100 },   // Stay at baseline
    { duration: '2m', target: 200 },   // Ramp up to 2× baseline
    { duration: '10m', target: 200 },  // Stress test at 2× baseline
    { duration: '2m', target: 100 },   // Ramp down to baseline
    { duration: '2m', target: 0 },      // Ramp down to zero
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<500'], // p95 < 300ms, p99 < 500ms
    http_req_failed: ['rate<0.01'], // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  // Test health endpoint
  let response = http.get(`${BASE_URL}/health`);
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 300ms': (r) => r.timings.duration < 300,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  sleep(0.1);

  // Test API endpoints with varying load
  const endpoints = [
    { path: '/api/user', weight: 30 },
    { path: '/api/transactions', weight: 25 },
    { path: '/health', weight: 20 },
    { path: '/metrics', weight: 15 },
    { path: '/api/messages', weight: 10 },
  ];

  // Weighted random endpoint selection
  const totalWeight = endpoints.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;
  let selectedEndpoint = endpoints[0];

  for (const endpoint of endpoints) {
    random -= endpoint.weight;
    if (random <= 0) {
      selectedEndpoint = endpoint;
      break;
    }
  }

  response = http.get(`${BASE_URL}${selectedEndpoint.path}`);
  check(response, {
    [`${selectedEndpoint.path} status is valid`]: (r) => r.status >= 200 && r.status < 500,
    [`${selectedEndpoint.path} response time < 300ms`]: (r) => r.timings.duration < 300,
  });
  errorRate.add(response.status >= 400);
  responseTime.add(response.timings.duration);
  requestCount.add(1);
  sleep(0.05);
}

export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    testType: 'stress_test_2x_baseline',
    metrics: {
      http_req_duration: data.metrics.http_req_duration,
      http_req_failed: data.metrics.http_req_failed,
      http_reqs: data.metrics.http_reqs,
      errors: data.metrics.errors,
      total_requests: data.metrics.total_requests,
    },
    thresholds: data.thresholds,
    summary: {
      p95: data.metrics.http_req_duration.values['p(95)'],
      p99: data.metrics.http_req_duration.values['p(99)'],
      errorRate: data.metrics.http_req_failed.values.rate,
      totalRequests: data.metrics.http_reqs.values.count,
      avgResponseTime: data.metrics.http_req_duration.values.avg,
    },
  };

  return {
    'stdout': JSON.stringify(summary, null, 2),
    'test-results/stress-test-summary.json': JSON.stringify(summary, null, 2),
  };
}

