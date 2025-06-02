/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  verbose: true,

  // Configuración específica para el test que funciona
  setupFiles: ['<rootDir>/jest-setup.js'],

  // NO usar setup-testing.js para evitar conflictos
  // setupFilesAfterEnv: [],

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Mapeo simple y directo
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    // Solo mapeos esenciales
    '^@expo/vector-icons/(.*)$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',
    '^@expo/vector-icons$': '<rootDir>/src/shared/utils/__mocks__/ExpoVectorIcons.js',

    // Assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/shared/utils/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transpilación
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nanoid|@shopify/flash-list|moment|@testing-library|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context)',
  ],

  testMatch: ['<rootDir>/src/features/auth/api/__tests__/authService.working.test.ts'],

  testTimeout: 15000,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,

  maxWorkers: 1,

  globals: {
    __DEV__: true,
  },

  // Debugging
  detectOpenHandles: false,
  detectLeaks: false,

  // Sin coverage para simplificar
  collectCoverage: false,
};

module.exports = config;
