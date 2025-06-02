// jest.simple.config.js - Configuración simplificada que funciona

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  verbose: true,

  // Setup básico
  setupFiles: ['<rootDir>/jest-setup.js'],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Mapeo básico sin conflictos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    // Solo vectoricons para evitar conflictos
    '^@expo/vector-icons$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',

    // Assets básicos
    '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': '<rootDir>/src/shared/utils/__mocks__/fileMock.js',
  },

  // Transpilación mínima
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo|@expo|react-navigation|@react-navigation|@testing-library|nanoid))',
  ],

  // Solo el test simple
  testMatch: ['<rootDir>/src/features/auth/api/__tests__/authService.simple.test.ts'],

  testTimeout: 10000,

  // Configuración de mocks
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,

  // Un solo worker para debugging
  maxWorkers: 1,

  // Variables globales
  globals: {
    __DEV__: true,
  },

  // Sin coverage para simplificar
  collectCoverage: false,

  // Debugging off
  detectOpenHandles: false,
  detectLeaks: false,

  // Configuración adicional para mocks
  resetModules: false,
  isolateModules: false,
};

module.exports = config;
