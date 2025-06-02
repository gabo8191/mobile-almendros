// src/features/auth/api/__tests__/authService.simple.test.ts
// VERSIÓN SIMPLE QUE SÍ FUNCIONA - Sin dynamic imports

// ===== CONFIGURAR TODOS LOS MOCKS ANTES DE IMPORTS =====

// 1. Mock axios API con implementación completa
const mockAxios = {
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
};

jest.mock('../../../../api/axios', () => mockAxios);

// 2. Mock endpoints
const mockEndpoints = {
  ENDPOINTS: {
    AUTH: {
      LOGIN_CLIENT: '/clients/login',
    },
  },
};

jest.mock('../../../../api/endpoints', () => mockEndpoints);

// 3. Mock secureStorage
const mockSecureStorage = {
  KEYS: {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
  },
  saveItem: jest.fn(),
  getItem: jest.fn(),
  deleteItem: jest.fn(),
  saveObject: jest.fn(),
  getObject: jest.fn(),
};

jest.mock('../../../../shared/utils/secureStorage', () => mockSecureStorage);

// ===== AHORA SÍ IMPORTAR LAS FUNCIONES =====
import { loginWithDocument, logout, getCurrentUser, hasActiveSession } from '../authService';

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

// ===== TESTS =====
describe('AuthService - Simple Test', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();

    // Configurar valores por defecto
    mockSecureStorage.saveItem.mockResolvedValue(undefined);
    mockSecureStorage.saveObject.mockResolvedValue(undefined);
    mockSecureStorage.getItem.mockResolvedValue(null);
    mockSecureStorage.getObject.mockResolvedValue(null);
    mockSecureStorage.deleteItem.mockResolvedValue(undefined);

    mockAxios.post.mockResolvedValue({ data: {} });
    mockAxios.get.mockResolvedValue({ data: {} });
  });

  describe('loginWithDocument', () => {
    it('should login successfully with valid credentials', async () => {
      console.log('🧪 Testing successful login...');

      // Configurar mock para respuesta exitosa
      mockAxios.post.mockResolvedValue({ data: mockBackendResponse });

      // Ejecutar función
      const result = await loginWithDocument('CC', '12345678');

      // Verificaciones
      expect(result).toBeDefined();
      expect(result.message).toBe('Login successful');
      expect(result.user.firstName).toBe('Juan');
      expect(result.token).toBe('mock-jwt-token');

      // Verificar llamadas a mocks
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

      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow(
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

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow('Documento inválido. Por favor intente nuevamente.');

      console.log('✅ Unauthorized test passed');
    });

    it('should handle network error', async () => {
      console.log('🧪 Testing network error...');

      const networkError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      };

      mockAxios.post.mockRejectedValue(networkError);

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );

      console.log('✅ Network error test passed');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      console.log('🧪 Testing logout...');

      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      await logout();

      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_token');
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_user');

      console.log('✅ Logout test passed');
    });

    it('should handle storage deletion errors', async () => {
      console.log('🧪 Testing logout with storage error...');

      mockSecureStorage.deleteItem.mockRejectedValue(new Error('Storage error'));

      await expect(logout()).rejects.toThrow('Error al cerrar sesión');

      console.log('✅ Logout error test passed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from storage', async () => {
      console.log('🧪 Testing get current user...');

      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockTransformedUser);
      expect(mockSecureStorage.getObject).toHaveBeenCalledWith('auth_user');

      console.log('✅ Get current user test passed');
    });

    it('should return null when no user in storage', async () => {
      console.log('🧪 Testing get current user with no user...');

      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ No user test passed');
    });

    it('should handle storage errors gracefully', async () => {
      console.log('🧪 Testing get current user with storage error...');

      mockSecureStorage.getObject.mockRejectedValue(new Error('Storage error'));

      const result = await getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ Storage error handling test passed');
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when valid token and user exist', async () => {
      console.log('🧪 Testing active session with valid data...');

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await hasActiveSession();

      expect(result).toBe(true);

      console.log('✅ Active session test passed');
    });

    it('should return false when no token exists', async () => {
      console.log('🧪 Testing active session with no token...');

      mockSecureStorage.getItem.mockResolvedValue(null);
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No token test passed');
    });

    it('should return false when no user exists', async () => {
      console.log('🧪 Testing active session with no user...');

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No user test passed');
    });

    it('should return false when user data is incomplete', async () => {
      console.log('🧪 Testing active session with incomplete user...');

      const incompleteUser = { id: '1' }; // Usuario sin datos requeridos

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(incompleteUser);

      const result = await hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Incomplete user test passed');
    });

    it('should handle errors gracefully', async () => {
      console.log('🧪 Testing active session with storage error...');

      mockSecureStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Session error handling test passed');
    });
  });

  // Test para verificar que todos los mocks están funcionando
  describe('Mock Verification', () => {
    it('should verify all mocks are working correctly', () => {
      console.log('🧪 Verifying all mocks are configured...');

      // Verificar que todos los mocks están definidos
      expect(mockAxios).toBeDefined();
      expect(mockAxios.post).toBeDefined();
      expect(mockEndpoints.ENDPOINTS).toBeDefined();
      expect(mockEndpoints.ENDPOINTS.AUTH.LOGIN_CLIENT).toBe('/clients/login');
      expect(mockSecureStorage.KEYS).toBeDefined();
      expect(mockSecureStorage.KEYS.AUTH_TOKEN).toBe('auth_token');

      // Verificar que las funciones importadas están disponibles
      expect(loginWithDocument).toBeDefined();
      expect(logout).toBeDefined();
      expect(getCurrentUser).toBeDefined();
      expect(hasActiveSession).toBeDefined();

      console.log('✅ All mocks are properly configured and working!');
    });
  });
});
