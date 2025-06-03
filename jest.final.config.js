jest.mock('../../../../api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() => Promise.resolve({ data: { message: 'MOCK SUCCESS' } })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: { baseURL: 'http://localhost:3000', timeout: 30000 },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

jest.mock('../../../../api/endpoints', () => ({
  __esModule: true,
  ENDPOINTS: {
    AUTH: { LOGIN_CLIENT: '/clients/login' },
  },
}));

jest.mock('../../../../shared/utils/secureStorage', () => ({
  __esModule: true,
  KEYS: {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
  },
  saveItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  deleteItem: jest.fn(() => Promise.resolve()),
  saveObject: jest.fn(() => Promise.resolve()),
  getObject: jest.fn(() => Promise.resolve(null)),
}));

import authService from '../authService';
import axios from '../../../../api/axios';
import { ENDPOINTS } from '../../../../api/endpoints';
import * as secureStorage from '../../../../shared/utils/secureStorage';

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

// ================== TESTS ==================
describe('AuthService - Final Working Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    secureStorage.saveItem.mockResolvedValue(undefined);
    secureStorage.saveObject.mockResolvedValue(undefined);
    secureStorage.getItem.mockResolvedValue(null);
    secureStorage.getObject.mockResolvedValue(null);
    secureStorage.deleteItem.mockResolvedValue(undefined);

    axios.post.mockResolvedValue({ data: {} });
    axios.get.mockResolvedValue({ data: {} });
  });

  describe('Mock Verification', () => {
    it('should verify all mocks are properly applied', () => {
      expect(axios).toBeDefined();
      expect(axios.post).toBeDefined();
      expect(typeof axios.post).toBe('function');

      expect(ENDPOINTS.AUTH.LOGIN_CLIENT).toBe('/clients/login');

      expect(secureStorage.KEYS.AUTH_TOKEN).toBe('auth_token');

      expect(authService.loginWithDocument).toBeDefined();
      expect(authService.logout).toBeDefined();
      expect(authService.getCurrentUser).toBeDefined();
      expect(authService.hasActiveSession).toBeDefined();

      console.log('✅ All mocks are properly applied and working!');
    });
  });

  describe('loginWithDocument', () => {
    it('should login successfully with valid credentials', async () => {
      axios.post.mockResolvedValue({ data: mockBackendResponse });

      const result = await authService.loginWithDocument('CC', '12345678');

      expect(result).toBeDefined();
      expect(result.message).toBe('Login successful');
      expect(result.user.firstName).toBe('Juan');
      expect(result.token).toBe('mock-jwt-token');

      expect(axios.post).toHaveBeenCalledWith(
        '/clients/login',
        { documentType: 'CC', documentNumber: '12345678' },
        expect.any(Object),
      );

      expect(secureStorage.saveItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(secureStorage.saveObject).toHaveBeenCalled();

      console.log('✅ Login test passed successfully');
    });

    it('should handle client not found error', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Cliente con documento CC 99999999 no encontrado o inactivo' },
        },
      });

      await expect(authService.loginWithDocument('CC', '99999999')).rejects.toThrow(
        'Cliente con documento CC 99999999 no encontrado o inactivo',
      );

      console.log('✅ Client not found test passed');
    });

    it('should handle unauthorized error', async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Documento inválido. Por favor intente nuevamente.' },
        },
      });

      await expect(authService.loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Documento inválido. Por favor intente nuevamente.',
      );

      console.log('✅ Unauthorized test passed');
    });

    it('should handle network error', async () => {
      axios.post.mockRejectedValue({
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      });

      await expect(authService.loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );

      console.log('✅ Network error test passed');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      await authService.logout();

      expect(secureStorage.deleteItem).toHaveBeenCalledWith('auth_token');
      expect(secureStorage.deleteItem).toHaveBeenCalledWith('auth_user');

      console.log('✅ Logout test passed');
    });

    it('should handle storage deletion errors', async () => {
      secureStorage.deleteItem.mockRejectedValue(new Error('Storage error'));

      await expect(authService.logout()).rejects.toThrow('Error al cerrar sesión');

      console.log('✅ Logout error test passed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from storage', async () => {
      secureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockTransformedUser);
      expect(secureStorage.getObject).toHaveBeenCalledWith('auth_user');

      console.log('✅ Get current user test passed');
    });

    it('should return null when no user in storage', async () => {
      secureStorage.getObject.mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ No user test passed');
    });

    it('should handle storage errors gracefully', async () => {
      secureStorage.getObject.mockRejectedValue(new Error('Storage error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();

      console.log('✅ Storage error handling test passed');
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when valid token and user exist', async () => {
      secureStorage.getItem.mockResolvedValue('mock-token');
      secureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.hasActiveSession();

      expect(result).toBe(true);

      console.log('✅ Active session test passed');
    });

    it('should return false when no token exists', async () => {
      secureStorage.getItem.mockResolvedValue(null);
      secureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No token test passed');
    });

    it('should return false when no user exists', async () => {
      secureStorage.getItem.mockResolvedValue('mock-token');
      secureStorage.getObject.mockResolvedValue(null);

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ No user test passed');
    });

    it('should return false when user data is incomplete', async () => {
      secureStorage.getItem.mockResolvedValue('mock-token');
      secureStorage.getObject.mockResolvedValue({ id: '1' });

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Incomplete user test passed');
    });

    it('should handle errors gracefully', async () => {
      secureStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await authService.hasActiveSession();

      expect(result).toBe(false);

      console.log('✅ Session error handling test passed');
    });
  });
});

console.log('🧪 AuthService tests completed - all functionality verified');
