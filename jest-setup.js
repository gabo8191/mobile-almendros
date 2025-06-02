// Configuraciones globales básicas para Jest

// Mock para el entorno de desarrollo
global.__DEV__ = true;

// Mock para el objeto global window si no existe
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock para alert y confirm (usado en web)
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Configurar fetch global para testing si no existe
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Configurar TextEncoder/TextDecoder para Node.js
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Suprimir warnings específicos durante tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('expo-constants') || args[0].includes('ExpoConstants') || args[0].includes('Could not locate module'))
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

// Mock básico para módulos nativos problemáticos
jest.mock('react-native/Libraries/NativeModules/specs/NativeSourceCode', () => ({}), { virtual: true });
