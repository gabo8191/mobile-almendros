import React, { createContext, useState, useEffect, useContext } from 'react';
import { getOrders, getOrderById, getOrderDetails } from '../api/ordersService';
import { Order, OrderDetail } from '../types/orders.types';
import { useAuth } from '../../../shared/context/AuthContext';

type OrdersContextType = {
  orders: Order[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  getPurchaseDetails: (id: string) => Promise<OrderDetail | null>;
};

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  refreshOrders: async () => {},
  getOrderById: async () => null,
  getPurchaseDetails: async () => null,
});

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Changed to false initially
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();

  // Fetch orders when component mounts or user changes, but only if user exists and auth is not loading
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
      console.log('Fetching orders for user:', user.id);
      setIsLoading(true);
      setError(null);

      const data = await getOrders();
      console.log('Orders fetched successfully:', data);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders', err);
      setError('No se pudieron cargar los pedidos. Por favor, intente de nuevo.');
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
      console.log('Orders refreshed successfully:', data);
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to refresh orders', err);
      setError('No se pudieron actualizar los pedidos. Por favor, intente de nuevo.');
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
      return await getOrderById(id);
    } catch (err: any) {
      console.error('Failed to fetch order', err);
      setError('No se pudo cargar el pedido. Por favor, intente de nuevo.');
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
      return await getOrderDetails(id);
    } catch (err: any) {
      console.error('Failed to fetch purchase details', err);
      setError('No se pudo cargar los detalles de la compra. Por favor, intente de nuevo.');
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
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
