/**
 * Test Setup File
 * Configures test environment and global test utilities
 * 
 * IMPORTANT: This file must set all required environment variables BEFORE
 * any modules that import config.ts are loaded, otherwise validation will fail.
 */

import dotenv from 'dotenv';
import path from 'path';

// Set test environment FIRST
process.env.NODE_ENV = 'test';

// Set required environment variables BEFORE loading .env.test
// This ensures config validation passes when modules are imported
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/trustverify_test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret-minimum-32-characters-long-for-testing';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-minimum-32-characters-long-for-testing';
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test-encryption-key-minimum-32-characters-long';
process.env.API_VERSION = process.env.API_VERSION || 'v1';
process.env.GDPR_ENABLED = process.env.GDPR_ENABLED || 'false';
process.env.WAF_ENABLED = process.env.WAF_ENABLED || 'false';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';
process.env.LOG_FORMAT = process.env.LOG_FORMAT || 'json';

// Load test environment variables (will override defaults if .env.test exists)
dotenv.config({ path: path.join(process.cwd(), '.env.test') });

// Note: Jest globals (jest, afterAll, etc.) are available in test files
// This file is executed in Jest context, so these are available at runtime
// TypeScript may show errors but they will work at runtime

// Global test timeout (set in jest.config.js, but can be overridden here if needed)
// jest.setTimeout(10000); // Uncomment if needed

// Mock console methods in tests to reduce noise (optional)
// Uncomment if you want to suppress console output in tests
// const originalConsole = { ...console };
// global.console = {
//   ...originalConsole,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Clean up after all tests
// afterAll(async () => {
//   // Close any open connections
//   // Add cleanup logic here
// });

