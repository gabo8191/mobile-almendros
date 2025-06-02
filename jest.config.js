/** @type {import('jest').Config} */
const path = require('path');

const config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  verbose: true,
  resolver: undefined,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  setupFiles: ['<rootDir>/jest-setup.js'],
  setupFilesAfterEnv: [path.join(__dirname, 'setup-testing.js')],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Mapeo de rutas y assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native/Libraries/NativeModules/specs/NativeSourceCode$': '<rootDir>/src/shared/utils/__mocks__/NativeSourceCode.js',
    '^react-native/(.*)$': 'react-native/$1',
    '^@expo/vector-icons/(.*)$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',
    '^nanoid/non-secure$': 'nanoid',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/shared/utils/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transpilación: Ignorar estos módulos (excepto los listados explícitamente)
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nanoid|@shopify/flash-list|moment|@testing-library|react-native-reanimated)',
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
};

module.exports = config;
