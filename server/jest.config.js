/**
 * Jest Configuration for TrustVerify Backend Tests
 * 
 * IMPORTANT: Set test environment variables BEFORE any modules are imported
 * This ensures config validation passes when modules are loaded
 */

// Set required environment variables for tests BEFORE any imports
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/trustverify_test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret-minimum-32-characters-long-for-testing';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-minimum-32-characters-long-for-testing';
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test-encryption-key-minimum-32-characters-long';
process.env.API_VERSION = process.env.API_VERSION || 'v1';
process.env.GDPR_ENABLED = process.env.GDPR_ENABLED || 'false';
process.env.WAF_ENABLED = process.env.WAF_ENABLED || 'false';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';
process.env.LOG_FORMAT = process.env.LOG_FORMAT || 'json';

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'node',
        },
      },
    ],
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/testing/**',
    '!**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        types: ['jest', 'node'],
      },
    },
  },
  testTimeout: 10000,
  verbose: true,
};

