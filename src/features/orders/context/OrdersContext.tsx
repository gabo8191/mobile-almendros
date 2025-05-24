import React, { createContext, useState, useEffect, useContext } from 'react';
import { getOrders, getOrderById } from '../api/ordersService';
import { Order } from '../types/orders.types';
import { useAuth } from '../../../shared/context/AuthContext';

type OrdersContextType = {
  orders: Order[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  clearError: () => void;
};

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  refreshOrders: async () => {},
  getOrderById: async () => null,
  clearError: () => {},
});

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();

  // Limpiar errores manualmente
  const clearError = () => {
    setError(null);
  };

  // Obtener pedidos cuando el usuario esté autenticado
  useEffect(() => {
    console.log('OrdersProvider useEffect:', { user: !!user, authLoading });

    if (!authLoading && user) {
      console.log('User authenticated, fetching orders...');
      fetchOrders();
    } else if (!authLoading && !user) {
      console.log('No user authenticated, clearing orders');
      setOrders([]);
      setError(null);
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    if (!user) {
      console.log('No user, skipping fetch orders');
      return;
    }

    try {
      console.log('Fetching orders for user:', user.documentType, user.documentNumber);
      setIsLoading(true);
      setError(null);

      const data = await getOrders();
      console.log('Orders fetched successfully, count:', data.length);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);

      let errorMessage = 'No se pudieron cargar los pedidos.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (!user) {
      console.log('No user, skipping refresh orders');
      return;
    }

    try {
      console.log('Refreshing orders...');
      setIsRefreshing(true);
      setError(null);

      const data = await getOrders();
      console.log('Orders refreshed successfully, count:', data.length);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to refresh orders:', err);

      let errorMessage = 'No se pudieron actualizar los pedidos.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchOrderById = async (id: string): Promise<Order | null> => {
    if (!user) {
      console.log('No user, skipping fetch order by id');
      return null;
    }

    try {
      console.log('Fetching order by id:', id);
      const order = await getOrderById(id);
      console.log('Order fetched successfully:', order.orderNumber);
      return order;
    } catch (err: any) {
      console.error('Failed to fetch order:', err);

      let errorMessage = 'No se pudo cargar el pedido.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message === 'Pedido no encontrado') {
        errorMessage = 'El pedido solicitado no fue encontrado.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        isRefreshing,
        error,
        refreshOrders,
        getOrderById: fetchOrderById,
        clearError,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
