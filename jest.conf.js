const { pathsToModuleNameMapper } = require('ts-jest');

//  const { compilerOptions } = require('./tsconfig')

const {
  compilerOptions: { paths = {}, baseUrl = './' },
} = require('./tsconfig.json');
const environment = require('./webpack/environment');

module.exports = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|dayjs/esm|export-to-csv/output/)'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  //  preset: 'jest-preset-angular/presets/defaults-esm',

  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  globals: {
    ...environment,
  },
  roots: ['<rootDir>', `<rootDir>/${baseUrl}`],
  modulePaths: [`<rootDir>/${baseUrl}`],
  setupFiles: ['jest-date-mock'],
  setupFilesAfterEnv: [`<rootDir>/${baseUrl}__tests__/setup.ts`],
  cacheDirectory: '<rootDir>/target/jest-cache',
  coverageDirectory: '<rootDir>/target/test-results/',
  moduleNameMapper: Object.assign(
    pathsToModuleNameMapper(paths, { prefix: `<rootDir>/${baseUrl}/` }),
    { '^uuid$': 'uuid' },
    { '\\.(scss|css|less)$': '<rootDir>/__mocks__/styleMock.js' },
    { 'export-to-csv': '<rootDir>/__mocks__/exportCsvMock.js' },
    { cheerio: '<rootDir>/__mocks__/exportCheerioMock.js' },
  ),
  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/target/test-results/', outputName: 'TESTS-results-jest.xml' }]],
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: ['<rootDir>/src/main/webapp/app/**/@(*.)@(spec.ts)'],
  //  testURL: 'http://localhost/',

  /*  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|dayjs/esm)'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  globals: {
    ...environment,
  },
  roots: ['<rootDir>', `<rootDir>/${baseUrl}`],
  modulePaths: [`<rootDir>/${baseUrl}`],
  setupFiles: ['jest-date-mock'],
  setupFilesAfterEnv: [`<rootDir>/${baseUrl}__tests__/setup.ts`],
  cacheDirectory: '<rootDir>/target/jest-cache',
  coverageDirectory: '<rootDir>/target/test-results/',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: `<rootDir>/${baseUrl}/` }),
  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/target/test-results/', outputName: 'TESTS-results-jest.xml' }]],
  testResultsProcessor: 'jest-sonar-reporter',*/
  //  testMatch: ['<rootDir>/src/main/webapp/app/**/@(*.)@(spec.ts)'],
  //  testURL: 'http://localhost/',
};
