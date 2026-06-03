module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 20000, // swisseph + ingress scans can take a moment
  moduleNameMapper: {
    // uuid v14 is pure ESM — remap to a CJS shim for Jest's CommonJS environment
    '^uuid$': '<rootDir>/tests/__mocks__/uuid.js'
  }
};
