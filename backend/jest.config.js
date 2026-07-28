module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/src/server.js'],
  testTimeout: 10000,
  verbose: true,
};
