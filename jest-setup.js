// Configuraciones globales básicas para Jest

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

// Mock para alert y confirm
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

// Configurar TextEncoder/TextDecoder
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

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('🧪') ||
      args[0].includes('✅') ||
      args[0].includes('❌') ||
      args[0].includes('MOCK SUCCESS') ||
      args[0].includes('ERROR'))
  ) {
    originalConsoleLog.call(console, ...args);
  }
};
