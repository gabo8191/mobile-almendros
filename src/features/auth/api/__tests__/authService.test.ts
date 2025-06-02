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
jest.mock('../../../../shared/utils/secureStorage', () => mockSecureStore);

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
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

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

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
    });

    it('should throw error for invalid credentials', async () => {
      mockAxios.post.mockRejectedValue(mockApiError(404, 'User not found'));

      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow('User not found');
    });

    it('should throw network error when connection fails', async () => {
      mockAxios.post.mockRejectedValue({ code: 'NETWORK_ERROR' });

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );
    });

    it('should handle unauthorized error', async () => {
      mockAxios.post.mockRejectedValue(mockApiError(401, 'Unauthorized'));

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow('Documento inválido. Por favor intente nuevamente.');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);

      await logout();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user');
    });

    it('should handle storage deletion errors gracefully', async () => {
      mockSecureStore.deleteItemAsync.mockRejectedValue(new Error('Storage error'));

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

      mockSecureStore.getItemAsync.mockResolvedValue(JSON.stringify(mockUser));

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user in storage', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });

    it('should handle storage errors', async () => {
      mockSecureStore.getItemAsync.mockRejectedValue(new Error('Storage error'));

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when valid token and user exist', async () => {
      mockSecureStore.getItemAsync
        .mockResolvedValueOnce('mock-token') // token
        .mockResolvedValueOnce(
          JSON.stringify({
            id: '1',
            documentType: 'CC',
            documentNumber: '12345678',
          }),
        ); // user

      const result = await hasActiveSession();
      expect(result).toBe(true);
    });

    it('should return false when no token exists', async () => {
      mockSecureStore.getItemAsync
        .mockResolvedValueOnce(null) // no token
        .mockResolvedValueOnce(JSON.stringify({ id: '1' })); // user exists but no token

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });

    it('should return false when no user exists', async () => {
      mockSecureStore.getItemAsync
        .mockResolvedValueOnce('mock-token') // token exists
        .mockResolvedValueOnce(null); // no user

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });

    it('should return false when user data is incomplete', async () => {
      mockSecureStore.getItemAsync
        .mockResolvedValueOnce('mock-token') // token exists
        .mockResolvedValueOnce(JSON.stringify({ id: '1' })); // incomplete user

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockSecureStore.getItemAsync.mockRejectedValue(new Error('Storage error'));

      const result = await hasActiveSession();
      expect(result).toBe(false);
    });
  });
});
