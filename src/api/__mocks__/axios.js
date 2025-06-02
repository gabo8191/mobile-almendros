// Mock para axios API client
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// Exportar como default (para import default)
module.exports = mockAxiosInstance;

// También exportar como default property
module.exports.default = mockAxiosInstance;
