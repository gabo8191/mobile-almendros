// Configuraciones globales para Jest
console.log('🧪 Loading test setup...');

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

// Configurar fetch global para testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  }),
);

// Configurar TextEncoder/TextDecoder para Node
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// ===== CRITICAL MOCKS =====

// Mock para secureStorage
jest.doMock('src/shared/utils/secureStorage', () => {
  const mockStorage = {
    KEYS: {
      AUTH_TOKEN: 'auth_token',
      AUTH_USER: 'auth_user',
    },
    saveItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    deleteItem: jest.fn(() => Promise.resolve()),
    saveObject: jest.fn(() => Promise.resolve()),
    getObject: jest.fn(() => Promise.resolve(null)),
  };

  return mockStorage;
});

// Mock para React Native modules problemáticos
jest.mock('react-native/Libraries/NativeModules/specs/NativeSourceCode', () => ({
  getConstants: jest.fn(() => ({})),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

// Mock para Expo SecureStore
const mockSecureStore = {
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
};

jest.mock('expo-secure-store', () => mockSecureStore);

// Mock para Expo Router
const mockRouterInstance = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => false),
  setParams: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouterInstance,
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  useGlobalSearchParams: () => ({}),
  router: mockRouterInstance,
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
  Link: ({ children, href, ...props }) => {
    const React = require('react');
    const { TouchableOpacity } = require('react-native');
    return React.createElement(TouchableOpacity, { ...props, onPress: () => mockRouterInstance.push(href) }, children);
  },
}));

// Mock para axios
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  default: mockAxiosInstance,
  ...mockAxiosInstance,
}));

// Mock para Expo Vector Icons
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

// Mock para Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      environment: 'development',
    },
  },
  default: {
    expoConfig: {
      extra: {
        environment: 'development',
      },
    },
  },
}));

// Mock para config
const mockConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
  },
  auth: {
    storageKeys: {
      token: 'auth_token',
      user: 'auth_user',
    },
  },
  environment: 'development',
};

jest.mock('../config', () => ({ default: mockConfig }), { virtual: true });
jest.mock('../../config', () => ({ default: mockConfig }), { virtual: true });
jest.mock('../../../config', () => ({ default: mockConfig }), { virtual: true });
jest.mock('../src/config', () => ({ default: mockConfig }), { virtual: true });
jest.mock('../../src/config', () => ({ default: mockConfig }), { virtual: true });
jest.mock('../../../src/config', () => ({ default: mockConfig }), { virtual: true });

// Suprimir warnings específicos durante tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: componentWillReceiveProps has been renamed') ||
        args[0].includes('Could not locate module') ||
        args[0].includes('moduleNameMapper') ||
        args[0].includes('Cannot read properties of undefined'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('expo-constants') ||
        args[0].includes('ExpoConstants') ||
        args[0].includes('Warning: componentWillReceiveProps') ||
        args[0].includes('Could not locate module') ||
        args[0].includes('moduleNameMapper'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

global.mockAxiosInstance = mockAxiosInstance;
global.mockSecureStore = mockSecureStore;

console.log('✅ Test setup loaded successfully');
