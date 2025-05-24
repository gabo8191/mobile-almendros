import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getOrders, getOrderById, getOrderDetails, getOrderHistory } from '../api/ordersService';
import { Order, OrderDetail, OrdersResponse, OrderFilters } from '../types/orders.types';
import { useAuth } from '../../../shared/context/AuthContext';

type OrdersContextType = {
  orders: Order[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  getPurchaseDetails: (id: string) => Promise<OrderDetail | null>;
  getOrderHistory: (filters?: OrderFilters) => Promise<OrdersResponse | null>;
  clearError: () => void;
};

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  refreshOrders: async () => {},
  getOrderById: async () => null,
  getPurchaseDetails: async () => null,
  getOrderHistory: async () => null,
  clearError: () => {},
});

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch orders when component mounts or user changes
  useEffect(() => {
    console.log('OrdersProvider useEffect:', {
      user: !!user,
      authLoading,
      userRole: user?.role,
      userDocumentType: user?.documentType,
    });

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
      console.log('Fetching orders for user:', user.id);
      setIsLoading(true);
      setError(null);

      const data = await getOrders();
      console.log('Orders fetched successfully:', data.length, 'orders');
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders', err);

      if (err.message === 'Unauthorized') {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('No se pudieron cargar los pedidos. Por favor, intente de nuevo.');
      }
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
      console.log('Orders refreshed successfully:', data.length, 'orders');
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to refresh orders', err);

      if (err.message === 'Unauthorized') {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('No se pudieron actualizar los pedidos. Por favor, intente de nuevo.');
      }
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

      if (order) {
        console.log('Order fetched successfully:', order.orderNumber);
      } else {
        console.log('Order not found');
      }

      return order;
    } catch (err: any) {
      console.error('Failed to fetch order', err);

      if (err.message === 'Unauthorized') {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('No se pudo cargar el pedido. Por favor, intente de nuevo.');
      }

      return null;
    }
  };

  const fetchPurchaseDetails = async (id: string): Promise<OrderDetail | null> => {
    if (!user) {
      console.log('No user, skipping fetch purchase details');
      return null;
    }

    try {
      console.log('Fetching purchase details for id:', id);

      // Primero intentamos obtener detalles completos
      let orderDetail = await getOrderDetails(id);

      if (!orderDetail) {
        // Si no hay detalles, intentamos obtener la orden básica
        console.log('No detailed order found, trying basic order...');
        const basicOrder = await getOrderById(id);

        if (basicOrder) {
          // Convertimos la orden básica a formato de detalle
          orderDetail = {
            ...basicOrder,
            store: 'Almendros',
            products: basicOrder.items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              subtotal: item.price * item.quantity,
              description: item.description,
            })),
          };
        }
      }

      if (orderDetail) {
        console.log('Purchase details fetched successfully:', orderDetail.orderNumber);
      } else {
        console.log('Purchase details not found');
      }

      return orderDetail;
    } catch (err: any) {
      console.error('Failed to fetch purchase details', err);

      if (err.message === 'Unauthorized') {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('No se pudo cargar los detalles de la compra. Por favor, intente de nuevo.');
      }

      return null;
    }
  };

  const fetchOrderHistory = async (filters?: OrderFilters): Promise<OrdersResponse | null> => {
    if (!user) {
      console.log('No user, skipping fetch order history');
      return null;
    }

    try {
      console.log('Fetching order history with filters:', filters);
      const historyData = await getOrderHistory(filters);
      console.log('Order history fetched successfully');
      return historyData;
    } catch (err: any) {
      console.error('Failed to fetch order history', err);

      if (err.message === 'Unauthorized') {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        setError('No se pudo cargar el historial de pedidos. Por favor, intente de nuevo.');
      }

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
        getPurchaseDetails: fetchPurchaseDetails,
        getOrderHistory: fetchOrderHistory,
        clearError,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
