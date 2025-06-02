declare global {
  var mockAxiosInstance: any;
  var mockSecureStorageService: any;
}

const mockAxiosInstance = global.mockAxiosInstance;
const mockSecureStorage = global.mockSecureStorageService;

// Now import the function to test
import { loginWithDocument, logout, getCurrentUser, hasActiveSession } from '../authService';

describe('AuthService', () => {
  // Mock backend response template
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

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset axios mock
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.get.mockClear();

    // Reset secure storage mocks
    mockSecureStorage.saveItem.mockClear();
    mockSecureStorage.getItem.mockClear();
    mockSecureStorage.deleteItem.mockClear();
    mockSecureStorage.saveObject.mockClear();
    mockSecureStorage.getObject.mockClear();

    // Reset to default implementations
    mockSecureStorage.saveItem.mockResolvedValue(undefined);
    mockSecureStorage.saveObject.mockResolvedValue(undefined);
    mockSecureStorage.getItem.mockResolvedValue(null);
    mockSecureStorage.getObject.mockResolvedValue(null);
    mockSecureStorage.deleteItem.mockResolvedValue(undefined);
  });

  describe('loginWithDocument', () => {
    it('should login successfully with valid credentials', async () => {
      // Configure mocks for successful login
      mockAxiosInstance.post.mockResolvedValue({ data: mockBackendResponse });

      const result = await loginWithDocument('CC', '12345678');

      expect(result).toEqual({
        message: 'Login successful',
        user: mockTransformedUser,
        token: 'mock-jwt-token',
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
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
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow('User not found');
    });

    it('should throw network error when connection fails', async () => {
      mockAxiosInstance.post.mockRejectedValue({
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
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow('Unauthorized');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      // Make sure deleteItem resolves successfully
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
