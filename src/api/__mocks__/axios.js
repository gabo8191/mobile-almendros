// Mock para axios API client
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn((onFulfilled, onRejected) => {
        return 1; // Retornar un ID del interceptor
      }),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn((onFulfilled, onRejected) => {
        return 1; // Retornar un ID del interceptor
      }),
      eject: jest.fn(),
    },
  },
  get: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }),
  ),
  post: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }),
  ),
  put: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }),
  ),
  delete: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }),
  ),
  patch: jest.fn(() =>
    Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }),
  ),
  defaults: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  create: jest.fn(() => mockAxiosInstance),
  request: jest.fn(() => Promise.resolve({ data: {} })),
  all: jest.fn(),
  spread: jest.fn(),
};

module.exports = mockAxiosInstance;
module.exports.default = mockAxiosInstance;
