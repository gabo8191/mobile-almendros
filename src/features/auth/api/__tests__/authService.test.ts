import { loginWithDocument, logout, getCurrentUser, hasActiveSession } from '../authService';

// Mock para SecureStore
const mockSecureStore = {
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

// Mock del módulo axios
const mockAxios = {
  post: jest.fn(),
  defaults: { baseURL: 'http://localhost:3000' },
};

// Mock para el módulo de secureStorage
const mockSecureStorage = {
  saveItem: jest.fn(),
  getItem: jest.fn(),
  deleteItem: jest.fn(),
  saveObject: jest.fn(),
  getObject: jest.fn(),
  KEYS: {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
  },
};

// Mock para API responses
const mockApiResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Mock para errores de API
const mockApiError = (status: number, message: string) => ({
  response: {
    status,
    data: { message },
    statusText: 'Error',
  },
  message,
});

// Aplicar los mocks
jest.mock('../../../../api/axios', () => mockAxios);
jest.mock('../../../../shared/utils/secureStorage', () => mockSecureStorage);

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithDocument', () => {
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

    it('should login successfully with valid credentials', async () => {
      mockAxios.post.mockResolvedValue(mockApiResponse(mockBackendResponse));
      mockSecureStorage.saveItem.mockResolvedValue(undefined);
      mockSecureStorage.saveObject.mockResolvedValue(undefined);

      const result = await loginWithDocument('CC', '12345678');

      expect(result).toEqual({
        message: 'Login successful',
        user: {
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
        },
        token: 'mock-jwt-token',
      });

      expect(mockSecureStorage.saveItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(mockSecureStorage.saveObject).toHaveBeenCalled();
    });

    it('should throw error for invalid credentials', async () => {
      const error = mockApiError(404, 'User not found');
      mockAxios.post.mockRejectedValue(error);

      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow('User not found');
    });

    it('should throw network error when connection fails', async () => {
      mockAxios.post.mockRejectedValue({ code: 'NETWORK_ERROR' });

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );
    });

    it('should handle unauthorized error', async () => {
      const error = mockApiError(401, 'Unauthorized');
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
      const mockUser = {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        documentType: 'CC',
        documentNumber: '12345678',
        isActive: true,
        email: 'juan@example.com',
        phoneNumber: '',
        address: '',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      mockSecureStorage.getObject.mockResolvedValue(mockUser);

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
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
      mockSecureStorage.getItem
        .mockResolvedValueOnce('mock-token') // token
        .mockResolvedValueOnce(
          JSON.stringify({
            id: '1',
            documentType: 'CC',
            documentNumber: '12345678',
            firstName: 'Juan',
            lastName: 'Pérez',
          }),
        ); // user

      // Mock getCurrentUser to return a valid user
      mockSecureStorage.getObject.mockResolvedValue({
        id: '1',
        documentType: 'CC',
        documentNumber: '12345678',
        firstName: 'Juan',
        lastName: 'Pérez',
      });

      const result = await hasActiveSession();
      expect(result).toBe(true);
    });

    it('should return false when no token exists', async () => {
      mockSecureStorage.getItem
        .mockResolvedValueOnce(null) // no token
        .mockResolvedValueOnce(JSON.stringify({ id: '1' })); // user exists but no token

      mockSecureStorage.getObject.mockResolvedValue({ id: '1' });

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });

    it('should return false when no user exists', async () => {
      mockSecureStorage.getItem
        .mockResolvedValueOnce('mock-token') // token exists
        .mockResolvedValueOnce(null); // no user

      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });

    it('should return false when user data is incomplete', async () => {
      mockSecureStorage.getItem
        .mockResolvedValueOnce('mock-token') // token exists
        .mockResolvedValueOnce(JSON.stringify({ id: '1' })); // incomplete user

      mockSecureStorage.getObject.mockResolvedValue({ id: '1' }); // incomplete user

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
