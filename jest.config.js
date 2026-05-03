module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '\\.(html)$': '<rootDir>/__mocks__/htmlMock.js',   // <--- important
    '\\.(css|scss)$': 'identity-obj-proxy'
  }, 
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  testMatch: ['**/*.spec.ts']
};
