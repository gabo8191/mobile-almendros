/** @type {import('jest').Config} */
const path = require('path');

const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [path.join(__dirname, 'setup-testing.js')],

  // Configuración para manejar las transformaciones de módulos
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nanoid|@shopify/flash-list|moment|@testing-library)',
  ],

  // Directorios de módulos
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Configuración de coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.types.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/**',
  ],

  // Configuración de mocks
  setupFiles: ['<rootDir>/jest-setup.js'],

  // Configuración más permisiva para evitar errores
  testEnvironment: 'node',
  verbose: true,
};

module.exports = config;
