// https://kulshekhar.github.io/ts-jest/user/config/#jest-config-with-helper
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const {compilerOptions} = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/jest-setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/src/' }  ),
  // globalSetup: "<rootDir>/src/jest-setup.ts",
  // globalTeardown: "<rootDir>/src/jest-teardown.ts"
};
