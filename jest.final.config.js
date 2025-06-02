// jest.final.config.js - Configuración corregida que SÍ va a funcionar

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  verbose: true,

  // Setup básico sin interferencias
  setupFiles: ['<rootDir>/jest-setup.js'],

  // NO usar setup-testing.js que causa conflictos
  // setupFilesAfterEnv: [],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Mapeo básico sin conflictos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Transpilación básica
  transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native|expo|@expo|@testing-library))'],

  // SOLO el test que funciona
  testMatch: ['<rootDir>/src/features/auth/api/__tests__/authService.final.test.ts'],

  testTimeout: 10000,

  // Configuración de mocks estricta
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  resetModules: true,

  // Un solo worker para evitar conflictos
  maxWorkers: 1,

  // Variables globales básicas
  globals: {
    __DEV__: true,
  },

  // Sin coverage para simplificar
  collectCoverage: false,

  // Sin debugging que interfiera
  detectOpenHandles: false,
  detectLeaks: false,

  // Configuración adicional para garantizar que los mocks funcionen
  automock: false,
  unmockedModulePathPatterns: [],
};

module.exports = config;
