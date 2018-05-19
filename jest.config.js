module.exports = {
  bail: true,
  verbose: true,
  automock: true,
  resetModules: true,
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  testRegex: '.*-test.*',
  unmockedModulePathPatterns: ['react', 'node_modules']
};
