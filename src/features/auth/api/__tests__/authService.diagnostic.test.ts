const mockAxios = {
  post: jest.fn(() => Promise.resolve({ data: { message: 'MOCK WORKING' } })),
  defaults: { baseURL: 'http://localhost:3000' },
};

const mockEndpoints = {
  ENDPOINTS: {
    AUTH: { LOGIN_CLIENT: '/mock-login' },
  },
};

const mockSecureStorage = {
  KEYS: { AUTH_TOKEN: 'mock_token' },
  saveItem: jest.fn(() => Promise.resolve()),
};

jest.mock('../../../../api/axios', () => mockAxios);
jest.mock('../../../../api/endpoints', () => mockEndpoints);
jest.mock('../../../../shared/utils/secureStorage', () => mockSecureStorage);

import { loginWithDocument } from '../authService';

describe('AuthService Diagnostic', () => {
  it('should use mocked modules', async () => {
    console.log('🔍 Testing if mocks work...');

    try {
      await loginWithDocument('CC', '12345678');
      console.log('✅ Mocks are working - no real network call made');
    } catch (error: any) {
      console.log('❌ Error (expected):', error.message);

      if (!error.message.includes('ENDPOINTS')) {
        console.log('✅ Mocks are working - error is from mock logic, not missing ENDPOINTS');
      } else {
        console.log('❌ Mocks NOT working - still trying to use real modules');
      }
    }

    // Verificar que los mocks fueron llamados
    expect(mockAxios.post).toHaveBeenCalled();
    console.log('✅ Mock axios was called');
  });
});
