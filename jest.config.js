/** @type {import('jest').Config} */
const path = require('path');

const config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  verbose: false,
  silent: false,

  setupFiles: ['<rootDir>/jest-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-testing.js'],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // moduleNameMapper simplificado y más directo
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    // Mock específico para secureStorage
    '^src/shared/utils/secureStorage$': '<rootDir>/src/shared/utils/__mocks__/secureStorage.js',
    '^../../../../shared/utils/secureStorage$': '<rootDir>/src/shared/utils/__mocks__/secureStorage.js',
    '^../../../shared/utils/secureStorage$': '<rootDir>/src/shared/utils/__mocks__/secureStorage.js',
    '^../../shared/utils/secureStorage$': '<rootDir>/src/shared/utils/__mocks__/secureStorage.js',
    '^../shared/utils/secureStorage$': '<rootDir>/src/shared/utils/__mocks__/secureStorage.js',

    // Mock para axios API
    '^../../../../api/axios$': '<rootDir>/src/api/__mocks__/axios.js',
    '^../../../api/axios$': '<rootDir>/src/api/__mocks__/axios.js',
    '^../../api/axios$': '<rootDir>/src/api/__mocks__/axios.js',
    '^../api/axios$': '<rootDir>/src/api/__mocks__/axios.js',
    '^src/api/axios$': '<rootDir>/src/api/__mocks__/axios.js',

    // Mock para endpoints API
    '^../../../../api/endpoints$': '<rootDir>/src/api/__mocks__/endpoints.js',
    '^../../../api/endpoints$': '<rootDir>/src/api/__mocks__/endpoints.js',
    '^../../api/endpoints$': '<rootDir>/src/api/__mocks__/endpoints.js',
    '^../api/endpoints$': '<rootDir>/src/api/__mocks__/endpoints.js',
    '^src/api/endpoints$': '<rootDir>/src/api/__mocks__/endpoints.js',

    // Vector icons
    '^@expo/vector-icons/(.*)$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',
    '^@expo/vector-icons$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',

    // nanoid
    '^nanoid/non-secure$': 'nanoid',
    '^nanoid$': 'nanoid',

    // Assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/shared/utils/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transpilación específica
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nanoid|@shopify/flash-list|moment|@testing-library|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context)',
  ],

  // Recolección de coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/app/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],

  // Coverage thresholds más realistas
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },

  testTimeout: 15000,

  clearMocks: true,
  restoreMocks: false,
  resetMocks: false,

  maxWorkers: 1, // Run tests serially for better debugging
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.expo/'],

  // Global setup for mocks
  globals: {
    __DEV__: true,
  },

  haste: {
    defaultPlatform: 'ios',
    platforms: ['android', 'ios', 'native', 'web'],
  },

  detectOpenHandles: false,
  detectLeaks: false,

  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit.xml',
      },
    ],
  ],

  notify: false,
  notifyMode: 'failure',
};

module.exports = config;
