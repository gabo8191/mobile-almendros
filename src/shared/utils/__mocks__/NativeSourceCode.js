// Mock para NativeSourceCode de React Native
// Este módulo nativo causa problemas en Jest, así que lo mockeamos

module.exports = {
  getConstants: jest.fn(() => ({})),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};
