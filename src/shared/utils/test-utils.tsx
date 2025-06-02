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

// Mock para router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

// Mock para SecureStore
export const mockSecureStore = {
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

// Mock para API responses
export const mockApiResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Mock para errores de API
export const mockApiError = (status: number, message: string) => ({
  response: {
    status,
    data: { message },
    statusText: 'Error',
  },
  message,
});

// Función de render simple sin providers por ahora
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => rtlRender(ui, options);

// Re-exportar todo de react-native testing library
export * from '@testing-library/react-native';

// Usar nuestro render personalizado por defecto
export { customRender as render };
