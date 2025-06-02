// Mock para Expo SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock para Expo Router con implementación completa
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
  navigate: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  router: mockRouter,
  useSegments: () => [],
  usePathname: () => '/',
  useFocusEffect: jest.fn(),
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
  Link: ({ children, href, ...props }) => {
    const React = require('react');
    const { TouchableOpacity } = require('react-native');
    return React.createElement(TouchableOpacity, { ...props, onPress: () => mockRouter.push(href) }, children);
  },
}));

// Mock para React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
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
      style: { fontSize: size, color },
    });
  };

  return {
    Feather: MockIcon,
    MaterialIcons: MockIcon,
    Ionicons: MockIcon,
    AntDesign: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    MaterialCommunityIcons: MockIcon,
  };
});

// Mock para axios con implementación más completa
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

// CORREGIDO: Mock para secureStorage utils con path correcto
jest.mock('./src/shared/utils/secureStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  saveItem: jest.fn(() => Promise.resolve()),
  deleteItem: jest.fn(() => Promise.resolve()),
  getObject: jest.fn(() => Promise.resolve(null)),
  saveObject: jest.fn(() => Promise.resolve()),
  KEYS: {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
  },
}));

// Mock para formatters
jest.mock('./src/shared/utils/formatters', () => ({
  formatDate: jest.fn((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }),
  formatCurrency: jest.fn((amount) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }),
}));

// Mock para la configuración de la app
jest.mock('./src/config', () => ({
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
}));

// Mock para Expo Blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
}));

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock para async storage (si se usa)
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Configurar global window para web
if (typeof window === 'undefined') {
  global.window = {
    location: {
      href: 'http://localhost:3000',
    },
    alert: jest.fn(),
    confirm: jest.fn(() => true),
  };
} else {
  global.alert = jest.fn();
  global.confirm = jest.fn(() => true);
}

// Suprimir warnings específicos durante tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: componentWillReceiveProps has been renamed') ||
        args[0].includes('expo-constants') ||
        args[0].includes('ExpoConstants'))
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
        args[0].includes('Animated:') ||
        args[0].includes('VirtualizedLists'))
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

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
