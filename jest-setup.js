// Configuraciones globales para Jest

// Mock para el entorno de desarrollo
global.__DEV__ = true;

// Mock para el objeto global window si no existe
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock para alert (usado en web)
global.alert = jest.fn();

// Mock para confirm (usado en web)
global.confirm = jest.fn(() => true);

// Suprimir warnings específicos durante tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && (args[0].includes('expo-constants') || args[0].includes('ExpoConstants'))) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};
