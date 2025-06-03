const mockSecureStorage = {
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

// Exportar cada función individualmente para compatibilidad
module.exports = {
  ...mockSecureStorage,
  // Exportaciones nombradas
  saveItem: mockSecureStorage.saveItem,
  getItem: mockSecureStorage.getItem,
  deleteItem: mockSecureStorage.deleteItem,
  saveObject: mockSecureStorage.saveObject,
  getObject: mockSecureStorage.getObject,
  KEYS: mockSecureStorage.KEYS,
};

// También exportar como default
module.exports.default = mockSecureStorage;
