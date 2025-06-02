const mockAxiosInstance = {
  // Métodos HTTP principales
  get: jest.fn(() => Promise.resolve({ data: { message: 'Mock GET response' }, status: 200 })),
  post: jest.fn(() => Promise.resolve({ data: { message: 'Mock POST response' }, status: 200 })),
  put: jest.fn(() => Promise.resolve({ data: { message: 'Mock PUT response' }, status: 200 })),
  delete: jest.fn(() => Promise.resolve({ data: { message: 'Mock DELETE response' }, status: 200 })),
  patch: jest.fn(() => Promise.resolve({ data: { message: 'Mock PATCH response' }, status: 200 })),
  request: jest.fn(() => Promise.resolve({ data: { message: 'Mock REQUEST response' }, status: 200 })),

  // Interceptores
  interceptors: {
    request: {
      use: jest.fn((onFulfilled, onRejected) => 1),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn((onFulfilled, onRejected) => 1),
      eject: jest.fn(),
    },
  },

  // Configuración
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },

  // Métodos adicionales
  create: jest.fn(() => mockAxiosInstance),
  all: jest.fn(),
  spread: jest.fn(),

  // Metodos para testing
  __reset: () => {
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.put.mockClear();
    mockAxiosInstance.delete.mockClear();
    mockAxiosInstance.patch.mockClear();
    mockAxiosInstance.request.mockClear();
  },
};

// Log para debug
console.log('🔧 Loading mock axios instance');

module.exports = mockAxiosInstance;
module.exports.default = mockAxiosInstance;

// Para compatibilidad con import/export
module.exports.__esModule = true;
