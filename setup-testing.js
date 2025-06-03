// Setup de testing minimal

// Solo lo más básico y necesario
global.__DEV__ = true;

// Window object básico
if (typeof window === 'undefined') {
  global.window = {
    fs: { readFile: jest.fn() },
  };
}

// TextEncoder/TextDecoder
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// ===== MOCKS UNIVERSALES =====

// Mock para React Native modules
jest.mock('react-native/Libraries/NativeModules/specs/NativeSourceCode', () => ({
  getConstants: jest.fn(() => ({})),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

// Mock para Expo SecureStore (universal)
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock para Expo Router (universal)
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => false),
  setParams: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  useGlobalSearchParams: () => ({}),
  router: mockRouter,
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
  Link: ({ children, href, ...props }) => {
    const React = require('react');
    const { TouchableOpacity } = require('react-native');
    return React.createElement(TouchableOpacity, { ...props, onPress: () => mockRouter.push(href) }, children);
  },
}));

// Mock para Expo Vector Icons (universal)
jest.mock('@expo/vector-icons', () => {
  const MockIcon = ({ name, size, color, ...props }) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, {
      ...props,
      children: name,
      testID: `icon-${name}`,
      style: { fontSize: size || 24, color: color || '#000' },
    });
  };

  return {
    Feather: MockIcon,
    MaterialIcons: MockIcon,
    AntDesign: MockIcon,
    Ionicons: MockIcon,
    MaterialCommunityIcons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
  };
});

// Mock para Expo Constants (universal)
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: { environment: 'development' },
  },
  default: {
    expoConfig: {
      extra: { environment: 'development' },
    },
  },
}));

// Suprimir warnings molestos
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('expo-constants') ||
      args[0].includes('ExpoConstants') ||
      args[0].includes('Warning: componentWillReceiveProps') ||
      args[0].includes('Could not locate module'))
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

// Exponer router mock globalmente
global.mockRouter = mockRouter;
