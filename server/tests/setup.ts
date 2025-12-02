/**
 * Test Setup File
 * Configures test environment and global test utilities
 */

import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.test') });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/trustverify_test';

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

