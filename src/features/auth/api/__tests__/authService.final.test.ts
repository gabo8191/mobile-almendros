// src/features/auth/api/__tests__/authService.final.test.ts
// SOLUCIÓN DEFINITIVA QUE SÍ VA A FUNCIONAR

// ===== BLOQUEAR COMPLETAMENTE LOS MÓDULOS REALES =====

// 1. Mock axios ANTES que cualquier cosa
jest.mock('../../../../api/axios', () => {
  const mockAxios = {
    post: jest.fn(() => Promise.resolve({ data: { message: 'MOCK SUCCESS' } })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: { baseURL: 'http://localhost:3000', timeout: 30000 },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  console.log('🔧 MOCK: axios module blocked and mocked');
  return mockAxios;
});

// 2. Mock endpoints ANTES que cualquier cosa
jest.mock('../../../../api/endpoints', () => {
  const mockEndpoints = {
    ENDPOINTS: {
      AUTH: { LOGIN_CLIENT: '/clients/login' },
    },
  };
  console.log('🔧 MOCK: endpoints module blocked and mocked');
  return mockEndpoints;
});

// 3. Mock secureStorage ANTES que cualquier cosa
jest.mock('../../../../shared/utils/secureStorage', () => {
  const mockStorage = {
    KEYS: { AUTH_TOKEN: 'auth_token', AUTH_USER: 'auth_user' },
    saveItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    deleteItem: jest.fn(() => Promise.resolve()),
    saveObject: jest.fn(() => Promise.resolve()),
    getObject: jest.fn(() => Promise.resolve(null)),
  };
  console.log('🔧 MOCK: secureStorage module blocked and mocked');
  return mockStorage;
});

// ===== SOLO AHORA IMPORTAR =====
const authService = require('../authService');

// ===== ACCEDER A LOS MOCKS =====
const mockAxios = require('../../../../api/axios');
const mockEndpoints = require('../../../../api/endpoints');
const mockSecureStorage = require('../../../../shared/utils/secureStorage');

// ===== DATOS DE PRUEBA =====
const mockBackendResponse = {
  message: 'Login successful',
  user: {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    documentType: 'CC',
    documentNumber: '12345678',
    role: 'client',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  token: 'mock-jwt-token',
};

const mockTransformedUser = {
  id: '1',
  email: 'juan@example.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  phoneNumber: '',
  address: '',
  documentType: 'CC',
  documentNumber: '12345678',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('AuthService - Final Working Test', () => {
  beforeEach(() => {
    // Limpiar TODOS los mocks
    jest.clearAllMocks();

    // Configurar valores por defecto
    mockSecureStorage.saveItem.mockResolvedValue(undefined);
    mockSecureStorage.saveObject.mockResolvedValue(undefined);
    mockSecureStorage.getItem.mockResolvedValue(null);
    mockSecureStorage.getObject.mockResolvedValue(null);
    mockSecureStorage.deleteItem.mockResolvedValue(undefined);

    mockAxios.post.mockResolvedValue({ data: {} });
    mockAxios.get.mockResolvedValue({ data: {} });

    console.log('🧹 Mocks reset for new test');
  });

  // Test inicial para verificar que los mocks funcionan
  describe('Mock Verification', () => {
    it('should verify all mocks are properly applied', () => {
      console.log('🔍 Verifying mocks are applied...');

      // Verificar que tenemos los mocks
      expect(mockAxios).toBeDefined();
      expect(mockAxios.post).toBeDefined();
      expect(typeof mockAxios.post).toBe('function');

      expect(mockEndpoints).toBeDefined();
      expect(mockEndpoints.ENDPOINTS).toBeDefined();
      expect(mockEndpoints.ENDPOINTS.AUTH.LOGIN_CLIENT).toBe('/clients/login');

      expect(mockSecureStorage).toBeDefined();
      expect(mockSecureStorage.KEYS).toBeDefined();
      expect(mockSecureStorage.KEYS.AUTH_TOKEN).toBe('auth_token');

      // Verificar que las funciones están disponibles
      expect(authService.loginWithDocument).toBeDefined();
      expect(authService.logout).toBeDefined();
      expect(authService.getCurrentUser).toBeDefined();
      expect(authService.hasActiveSession).toBeDefined();

      console.log('✅ All mocks are properly applied and working!');
    });
  });

  describe('loginWithDocument', () => {
    it('should login successfully with valid credentials', async () => {
      console.log('🧪 Testing successful login...');

      // Configurar mock de axios para éxito
      mockAxios.post.mockResolvedValue({ data: mockBackendResponse });

      // Configurar mocks de storage
      mockSecureStorage.saveItem.mockResolvedValue(undefined);
      mockSecureStorage.saveObject.mockResolvedValue(undefined);

      // Ejecutar función
      const result = await authService.loginWithDocument('CC', '12345678');

      // Verificaciones
      expect(result).toBeDefined();
      expect(result.message).toBe('Login successful');
      expect(result.user.firstName).toBe('Juan');
      expect(result.token).toBe('mock-jwt-token');

      // Verificar llamadas
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/clients/login',
        { documentType: 'CC', documentNumber: '12345678' },
        expect.any(Object),
      );

      expect(mockSecureStorage.saveItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(mockSecureStorage.saveObject).toHaveBeenCalled();

      console.log('✅ Login test passed successfully');
    });

    it('should handle client not found error', async () => {
      console.log('🧪 Testing client not found error...');

      const mockError = {
        response: {
          status: 404,
          data: { message: 'Cliente con documento CC 99999999 no encontrado o inactivo' },
          statusText: 'Not Found',
        },
        message: 'Request failed with status code 404',
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(authService.loginWithDocument('CC', '99999999')).rejects.toThrow(
        'Cliente con documento CC 99999999 no encontrado o inactivo',
      );

      expect(mockAxios.post).toHaveBeenCalled();
      console.log('✅ Client not found test passed');
    });

    it('should handle unauthorized error', async () => {
      console.log('🧪 Testing unauthorized error...');

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Documento inválido. Por favor intente nuevamente.' },
          statusText: 'Unauthorized',
        },
        message: 'Request failed with status code 401',
      };

      mockAxios.post.mockRejectedValue(mockError);

      await expect(authService.loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Documento inválido. Por favor intente nuevamente.',
      );

      console.log('✅ Unauthorized test passed');
    });

    it('should handle network error', async () => {
      console.log('🧪 Testing network error...');

      const networkError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      };

      mockAxios.post.mockRejectedValue(networkError);

      await expect(authService.loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );

      console.log('✅ Network error test passed');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      console.log('🧪 Testing logout...');

      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_token');
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_user');

      console.log('✅ Logout test passed');
    });

    it('should handle storage deletion errors', async () => {
      console.log('🧪 Testing logout with storage error...');

      mockSecureStorage.deleteItem.mockRejectedValue(new Error('Storage error'));

      await expect(authService.logout()).rejects.toThrow('Error al cerrar sesión');

      console.log('✅ Logout error test passed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from storage', async () => {
      console.log('🧪 Testing get current user...');

      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockTransformedUser);
      expect(mockSecureStorage.getObject).toHaveBeenCalledWith('auth_user');

      console.log('✅ Get current user test passed');
    });

    it('should return null when no user in storage', async () => {
      console.log('🧪 Testing get current user with no user...');

      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ No user test passed');
    });

    it('should handle storage errors gracefully', async () => {
      console.log('🧪 Testing get current user with storage error...');

      mockSecureStorage.getObject.mockRejectedValue(new Error('Storage error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ Storage error handling test passed');
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when valid token and user exist', async () => {
      console.log('🧪 Testing active session with valid data...');

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.hasActiveSession();

      expect(result).toBe(true);

      console.log('✅ Active session test passed');
    });

    it('should return false when no token exists', async () => {
      console.log('🧪 Testing active session with no token...');

      mockSecureStorage.getItem.mockResolvedValue(null);
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No token test passed');
    });

    it('should return false when no user exists', async () => {
      console.log('🧪 Testing active session with no user...');

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No user test passed');
    });

    it('should return false when user data is incomplete', async () => {
      console.log('🧪 Testing active session with incomplete user...');

      const incompleteUser = { id: '1' }; // Usuario sin datos requeridos

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(incompleteUser);

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Incomplete user test passed');
    });

    it('should handle errors gracefully', async () => {
      console.log('🧪 Testing active session with storage error...');

      mockSecureStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Session error handling test passed');
    });
  });
});
