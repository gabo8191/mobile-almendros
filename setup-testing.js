// Configuraciones globales para Jest - UPDATED
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

// ===== MOCKS CRÍTICOS =====

// Mock para React Native modules problemáticos
jest.mock('react-native/Libraries/NativeModules/specs/NativeSourceCode', () => ({
  getConstants: jest.fn(() => ({})),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

// Mock para Expo SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock MEJORADO para Expo Router - MUY IMPORTANTE
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

// Mock para React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => false),
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

// Mock COMPLETO para axios - CRÍTICO
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
  ...mockAxiosInstance,
}));

// Mock para nuestro API instance específico
jest.mock('../../../api/axios', () => mockAxiosInstance, { virtual: true });
jest.mock('../../api/axios', () => mockAxiosInstance, { virtual: true });
jest.mock('../api/axios', () => mockAxiosInstance, { virtual: true });

// Mock para secureStorage
jest.mock(
  '../../../shared/utils/secureStorage',
  () => ({
    saveItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    deleteItem: jest.fn(() => Promise.resolve()),
    saveObject: jest.fn(() => Promise.resolve()),
    getObject: jest.fn(() => Promise.resolve(null)),
    KEYS: {
      AUTH_TOKEN: 'auth_token',
      AUTH_USER: 'auth_user',
    },
  }),
  { virtual: true },
);

// Mock para todos los paths posibles de secureStorage
jest.mock(
  '../../shared/utils/secureStorage',
  () => ({
    saveItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    deleteItem: jest.fn(() => Promise.resolve()),
    saveObject: jest.fn(() => Promise.resolve()),
    getObject: jest.fn(() => Promise.resolve(null)),
    KEYS: {
      AUTH_TOKEN: 'auth_token',
      AUTH_USER: 'auth_user',
    },
  }),
  { virtual: true },
);

jest.mock(
  '../shared/utils/secureStorage',
  () => ({
    saveItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    deleteItem: jest.fn(() => Promise.resolve()),
    saveObject: jest.fn(() => Promise.resolve()),
    getObject: jest.fn(() => Promise.resolve(null)),
    KEYS: {
      AUTH_TOKEN: 'auth_token',
      AUTH_USER: 'auth_user',
    },
  }),
  { virtual: true },
);

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

// Mock para Expo Blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
}));

// Mock para React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const RN = require('react-native');

  return {
    Swipeable: RN.View,
    DrawerLayout: RN.View,
    State: {},
    ScrollView: RN.ScrollView,
    Slider: RN.View,
    Switch: RN.Switch,
    TextInput: RN.TextInput,
    ToolbarAndroid: RN.View,
    ViewPagerAndroid: RN.View,
    DrawerLayoutAndroid: RN.View,
    WebView: RN.View,
    NativeViewGestureHandler: RN.View,
    TapGestureHandler: RN.View,
    FlingGestureHandler: RN.View,
    ForceTouchGestureHandler: RN.View,
    LongPressGestureHandler: RN.View,
    PanGestureHandler: RN.View,
    PinchGestureHandler: RN.View,
    RotationGestureHandler: RN.View,
    RawButton: RN.TouchableOpacity,
    BaseButton: RN.TouchableOpacity,
    RectButton: RN.TouchableOpacity,
    BorderlessButton: RN.TouchableOpacity,
    FlatList: RN.FlatList,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock para React Native Safe Area Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const RN = require('react-native');

  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: RN.View,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 0, height: 0 })),
  };
});

// Mock para nanoid
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mocked-id'),
}));

jest.mock('nanoid/non-secure', () => ({
  nanoid: jest.fn(() => 'mocked-id'),
}));

// Mock para React Native Screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: () => true,
}));

// Mock para expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
  SplashScreen: {
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
  },
}));

// Mock para config
jest.mock(
  '../config',
  () => ({
    default: {
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
    },
  }),
  { virtual: true },
);

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

// Limpiar mocks entre tests
beforeEach(() => {
  jest.clearAllMocks();
});

console.log('✅ Test setup loaded successfully');
