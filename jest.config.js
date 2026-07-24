'use strict';

/** @type {import('jest').Config} */
module.exports = {
  // Use Node.js as the test environment (no browser globals).
  testEnvironment: 'node',

  // Glob patterns Jest uses to detect test files.
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js', '**/*.spec.js'],

  // Directories Jest should skip when scanning for tests.
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Collect coverage from source files (excluding entry points and migrations).
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db/migrations/**',
    '!src/db/seeds/**',
  ],

  // Coverage output formats.
  coverageReporters: ['text', 'lcov', 'clover'],

  // Minimum coverage thresholds — build fails if any are unmet.
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Module name aliases that mirror the project's import conventions.
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Reset mocks automatically between every test.
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,

  // Verbose output so CI logs are easy to read.
  verbose: true,
};
