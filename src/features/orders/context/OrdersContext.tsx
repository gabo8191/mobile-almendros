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
};

const OrdersContext = createContext<OrdersContextType>({
    orders: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    refreshOrders: async () => { },
    getOrderById: async () => null,
});

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    // Fetch orders when component mounts or user changes
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            setError('No se pudieron cargar los pedidos. Por favor, intente de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshOrders = async () => {
        if (!user) return;

        try {
            setIsRefreshing(true);
            setError(null);

            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to refresh orders', err);
            setError('No se pudieron actualizar los pedidos. Por favor, intente de nuevo.');
        } finally {
            setIsRefreshing(false);
        }
    };

    const fetchOrderById = async (id: string): Promise<Order | null> => {
        if (!user) return null;

        try {
            return await getOrderById(id);
        } catch (err) {
            console.error('Failed to fetch order', err);
            setError('No se pudo cargar el pedido. Por favor, intente de nuevo.');
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
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => useContext(OrdersContext);