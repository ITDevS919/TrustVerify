/**
 * k6 Load Test Script
 * Target: p95 < 300ms
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 200 },  // Ramp up to 200 users
    { duration: '3m', target: 200 },  // Stay at 200 users
    { duration: '1m', target: 0 },     // Ramp down
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
  sleep(1);

  // Test API endpoints
  const endpoints = [
    '/api/user',
    '/health',
    '/metrics',
  ];

  for (const endpoint of endpoints) {
    response = http.get(`${BASE_URL}${endpoint}`);
    check(response, {
      [`${endpoint} status is valid`]: (r) => r.status >= 200 && r.status < 500,
      [`${endpoint} response time < 300ms`]: (r) => r.timings.duration < 300,
    });
    errorRate.add(response.status >= 400);
    responseTime.add(response.timings.duration);
    sleep(0.5);
  }
}

export function handleSummary(data) {
  // k6's handleSummary receives data object
  const summary = {
    timestamp: new Date().toISOString(),
    metrics: {
      http_req_duration: data.metrics.http_req_duration,
      http_req_failed: data.metrics.http_req_failed,
      http_reqs: data.metrics.http_reqs,
    },
    thresholds: data.thresholds,
  };

  return {
    'stdout': JSON.stringify(summary, null, 2),
    'test-results/load-test-summary.json': JSON.stringify(summary, null, 2),
  };
}

