/** @type {import('jest').Config} */
const path = require('path');

const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [path.join(__dirname, 'setup-testing.js')],
  setupFiles: ['<rootDir>/jest-setup.js'],

  // Configuración para manejar las transformaciones de módulos
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nanoid|@shopify/flash-list|moment|@testing-library|react-native-reanimated|expo-router)',
  ],

  // Directorios de módulos
  moduleDirectories: ['node_modules', '<rootDir>'],

  // CORREGIDO: moduleNameMapper (no moduleNameMapping)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^../src/(.*)$': '<rootDir>/src/$1',
    '^../../src/(.*)$': '<rootDir>/src/$1',
    '^../../../src/(.*)$': '<rootDir>/src/$1',
    '^../../../../src/(.*)$': '<rootDir>/src/$1',
    // Mocks para archivos estáticos
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Configuración de coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/jest-setup.js',
    '!**/setup-testing.js',
  ],

  // Extensiones de archivos que Jest debe procesar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Patrones para encontrar archivos de test
  testMatch: ['**/__tests__/**/*.(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],

  // Configuración del entorno de test
  testEnvironment: 'node',

  // Configuración más permisiva para evitar errores
  verbose: true,

  // Configuración de timeouts
  testTimeout: 10000,

  // Configuración para mocks globales
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Configuración para transformar archivos TypeScript
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};

module.exports = config;
