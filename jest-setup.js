// Configuraciones globales básicas para Jest - SIMPLIFIED VERSION

console.log('🔧 Loading basic Jest setup...');

// Mock para el entorno de desarrollo
global.__DEV__ = true;

// Mock para el objeto global window si no existe
if (typeof window === 'undefined') {
  global.window = {
    fs: {
      readFile: jest.fn(),
    },
  };
}

// Mock para alert y confirm (usado en web)
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Configurar fetch global para testing si no existe
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    }),
  );
}

// Configurar TextEncoder/TextDecoder para Node.js
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Configurar process.env por defecto
process.env.NODE_ENV = 'test';

// Suprimir warnings específicos de React Native en tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('expo-constants') ||
      args[0].includes('ExpoConstants') ||
      args[0].includes('Could not locate module') ||
      args[0].includes('Warning: componentWillReceiveProps'))
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

console.log('✅ Basic Jest setup completed');
