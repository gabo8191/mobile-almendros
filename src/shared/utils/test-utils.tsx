import React, { ReactElement, ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react-native';

// Mock de usuario para testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  phoneNumber: '123456789',
  address: 'Calle Test 123',
  documentType: 'CC',
  documentNumber: '12345678',
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

// Mock de compra para testing
export const mockPurchase = {
  id: '1',
  purchaseNumber: 'ALM-001',
  date: '2025-01-15T10:30:00Z',
  status: 'completed' as const,
  items: [
    {
      id: '1',
      name: 'Producto Test',
      quantity: 2,
      price: 15.5,
    },
  ],
  subtotal: 31.0,
  tax: 3.72,
  total: 34.72,
  paymentMethod: 'Efectivo',
};

// Mock para API responses
export const mockApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
  config: {},
});

// Mock para errores de API
export const mockApiError = (status: number, message: string) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { message },
    statusText: 'Error',
  };
  error.message = message;
  return error;
};

// Mock Provider para Context API (si es necesario en el futuro)
const MockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Función de render personalizada
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return rtlRender(ui, {
    wrapper: MockProvider,
    ...options,
  });
};

// Utilidades para testing
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    const checkCondition = () => {
      try {
        callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime < timeout) {
          setTimeout(checkCondition, 10);
        } else {
          reject(error);
        }
      }
    };

    checkCondition();
  });
};

// Helper para crear mocks de funciones con tipos
export const createMockFunction = <T extends (...args: any[]) => any>(implementation?: T): jest.MockedFunction<T> => {
  return jest.fn(implementation) as unknown as jest.MockedFunction<T>;
};

// Helper para resetear todos los mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
};

// Helper para crear datos de test consistentes
export const createMockPurchase = (overrides: Partial<typeof mockPurchase> = {}) => ({
  ...mockPurchase,
  ...overrides,
});

export const createMockUser = (overrides: Partial<typeof mockUser> = {}) => ({
  ...mockUser,
  ...overrides,
});

// Re-exportar todo de react-native testing library
export * from '@testing-library/react-native';

// Usar nuestro render personalizado por defecto
export { customRender as render };
