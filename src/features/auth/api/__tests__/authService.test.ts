// Test que usa mocks globales

// Mock datos para pruebas
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

// Mock explícito para secureStorage
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

// Mock explícito para axios
const mockAxios = {
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  },
};

// Mock explícito para endpoints
const mockEndpoints = {
  ENDPOINTS: {
    AUTH: {
      LOGIN_CLIENT: '/clients/login',
    },
  },
};

// Aplicar mocks ANTES de cualquier import
jest.mock('../../../../api/axios', () => ({ default: mockAxios }));
jest.mock('../../../../api/endpoints', () => mockEndpoints);
jest.mock('../../../../shared/utils/secureStorage', () => mockSecureStorage);

// Importar DESPUÉS de los mocks
import { loginWithDocument, logout, getCurrentUser, hasActiveSession } from '../authService';

describe('AuthService', () => {
  beforeEach(() => {
    // Limpiar todas las llamadas de los mocks
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
      // Configurar mocks para éxito
      mockAxios.post.mockResolvedValue({ data: mockBackendResponse });
      mockSecureStorage.saveItem.mockResolvedValue(undefined);
      mockSecureStorage.saveObject.mockResolvedValue(undefined);

      const result = await loginWithDocument('CC', '12345678');

      expect(result).toEqual({
        message: 'Login successful',
        user: mockTransformedUser,
        token: 'mock-jwt-token',
      });

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/clients/login',
        { documentType: 'CC', documentNumber: '12345678' },
        expect.any(Object),
      );
      expect(mockSecureStorage.saveItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(mockSecureStorage.saveObject).toHaveBeenCalledWith('auth_user', mockTransformedUser);
    });

    it('should throw error for invalid credentials', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'User not found' },
          statusText: 'Not Found',
        },
        message: 'Request failed with status code 404',
      };
      mockAxios.post.mockRejectedValue(error);

      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow('User not found');
    });

    it('should throw network error when connection fails', async () => {
      mockAxios.post.mockRejectedValue({
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      });

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );
    });

    it('should handle unauthorized error', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
          statusText: 'Unauthorized',
        },
        message: 'Request failed with status code 401',
      };
      mockAxios.post.mockRejectedValue(error);

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      await logout();

      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_token');
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_user');
    });

    it('should handle storage deletion errors gracefully', async () => {
      mockSecureStorage.deleteItem.mockRejectedValue(new Error('Storage error'));

      await expect(logout()).rejects.toThrow('Error al cerrar sesión');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from storage', async () => {
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockTransformedUser);
      expect(mockSecureStorage.getObject).toHaveBeenCalledWith('auth_user');
    });

    it('should return null when no user in storage', async () => {
      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle storage errors', async () => {
      mockSecureStorage.getObject.mockRejectedValue(new Error('Storage error'));

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when valid token and user exist', async () => {
      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await hasActiveSession();

      expect(result).toBe(true);
    });

    it('should return false when no token exists', async () => {
      mockSecureStorage.getItem.mockResolvedValue(null);
      mockSecureStorage.getObject.mockResolvedValue(mockTransformedUser);

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });

    it('should return false when no user exists', async () => {
      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });

    it('should return false when user data is incomplete', async () => {
      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue({ id: '1' }); // Incomplete user

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockSecureStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });
  });
});
