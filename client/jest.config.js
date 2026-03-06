require('dotenv').config({ path: '.env.test' })

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/app/tests/unit/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Transform @testing-library packages so Babel can downgrade modern syntax for Node 12
  transformIgnorePatterns: ['/node_modules/(?!@testing-library/)'],
}
