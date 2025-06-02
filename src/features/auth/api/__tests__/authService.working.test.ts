jest.doMock('../../../../api/axios', () => {
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

  console.log('🔧 Mock axios configurado');
  return mockAxios;
});

jest.doMock('../../../../api/endpoints', () => {
  const mockEndpoints = {
    ENDPOINTS: {
      AUTH: {
        LOGIN_CLIENT: '/clients/login',
      },
    },
  };

  console.log('🔧 Mock endpoints configurado');
  return mockEndpoints;
});

jest.doMock('../../../../shared/utils/secureStorage', () => {
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

  console.log('🔧 Mock secureStorage configurado');
  return mockStorage;
});

describe('AuthService - Working Test', () => {
  let loginWithDocument: any;
  let logout: any;
  let getCurrentUser: any;
  let hasActiveSession: any;

  let mockAxios: any;
  let mockEndpoints: any;
  let mockSecureStorage: any;

  // Configurar antes de cada test
  beforeAll(async () => {
    // Importar los mocks
    mockAxios = (await import('../../../../api/axios')).default;
    mockEndpoints = await import('../../../../api/endpoints');
    mockSecureStorage = await import('../../../../shared/utils/secureStorage');

    // Importar las funciones a testear
    const authService = await import('../authService');
    loginWithDocument = authService.loginWithDocument;
    logout = authService.logout;
    getCurrentUser = authService.getCurrentUser;
    hasActiveSession = authService.hasActiveSession;

    console.log('🔧 Tests configurados con mocks');
  });

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();

    // Configurar respuestas por defecto
    mockSecureStorage.saveItem.mockResolvedValue(undefined);
    mockSecureStorage.saveObject.mockResolvedValue(undefined);
    mockSecureStorage.getItem.mockResolvedValue(null);
    mockSecureStorage.getObject.mockResolvedValue(null);
    mockSecureStorage.deleteItem.mockResolvedValue(undefined);
  });

  describe('loginWithDocument', () => {
    it('should login successfully with valid credentials', async () => {
      // Configurar respuesta mock exitosa
      const mockResponse = {
        data: {
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
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      // Ejecutar función
      const result = await loginWithDocument('CC', '12345678');

      // Verificaciones
      expect(result).toBeDefined();
      expect(result.message).toBe('Login successful');
      expect(result.user.firstName).toBe('Juan');
      expect(result.token).toBe('mock-jwt-token');

      // Verificar que se llamaron los mocks correctos
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/clients/login',
        { documentType: 'CC', documentNumber: '12345678' },
        expect.any(Object),
      );
      expect(mockSecureStorage.saveItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(mockSecureStorage.saveObject).toHaveBeenCalled();
    });

    it('should handle login error correctly', async () => {
      // Configurar error mock
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Cliente no encontrado' },
        },
        message: 'Request failed',
      };

      mockAxios.post.mockRejectedValue(mockError);

      // Verificar que se lance error
      await expect(loginWithDocument('CC', '99999999')).rejects.toThrow('Cliente no encontrado');

      // Verificar que se llamó axios
      expect(mockAxios.post).toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      // Error de red
      const networkError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      };

      mockAxios.post.mockRejectedValue(networkError);

      await expect(loginWithDocument('CC', '12345678')).rejects.toThrow(
        'Error de conexión. Verifique su red e intente nuevamente.',
      );
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      mockSecureStorage.deleteItem.mockResolvedValue(undefined);

      await logout();

      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_token');
      expect(mockSecureStorage.deleteItem).toHaveBeenCalledWith('auth_user');
    });

    it('should handle storage errors', async () => {
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
      };

      mockSecureStorage.getObject.mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockSecureStorage.getObject).toHaveBeenCalledWith('auth_user');
    });

    it('should return null when no user exists', async () => {
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
    it('should return true when valid session exists', async () => {
      const mockUser = {
        id: '1',
        documentType: 'CC',
        documentNumber: '12345678',
        firstName: 'Juan',
        lastName: 'Pérez',
      };

      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(mockUser);

      const result = await hasActiveSession();

      expect(result).toBe(true);
    });

    it('should return false when no token exists', async () => {
      mockSecureStorage.getItem.mockResolvedValue(null);

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });

    it('should return false when no user exists', async () => {
      mockSecureStorage.getItem.mockResolvedValue('mock-token');
      mockSecureStorage.getObject.mockResolvedValue(null);

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockSecureStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await hasActiveSession();

      expect(result).toBe(false);
    });
  });

  // Test de integración para verificar que todos los mocks funcionan
  describe('Integration Test', () => {
    it('should demonstrate that all mocks are working', async () => {
      console.log('🧪 Testing mock integration...');

      // Verificar que los mocks están disponibles
      expect(mockAxios).toBeDefined();
      expect(mockAxios.post).toBeDefined();
      expect(mockEndpoints.ENDPOINTS).toBeDefined();
      expect(mockSecureStorage.KEYS).toBeDefined();

      // Verificar que las funciones están disponibles
      expect(loginWithDocument).toBeDefined();
      expect(logout).toBeDefined();
      expect(getCurrentUser).toBeDefined();
      expect(hasActiveSession).toBeDefined();

      console.log('✅ All mocks and functions are properly configured');
    });
  });
});
