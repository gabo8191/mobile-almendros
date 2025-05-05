import { createContext, useState, useEffect, ReactNode } from 'react';
import { getOrders, getOrderById } from '../api/ordersService';
import { Order } from '../types/orders.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

type OrdersContextType = {
    orders: Order[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    refreshOrders: () => Promise<void>;
    getOrderById: (id: string) => Promise<Order | null>;
};

export const OrdersContext = createContext<OrdersContextType>({
    orders: [],
    loading: false,
    error: null,
    refreshing: false,
    refreshOrders: async () => { },
    getOrderById: async () => null,
});

type OrdersProviderProps = {
    children: ReactNode;
};

export function OrdersProvider({ children }: OrdersProviderProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { user, token } = useAuth();

    // Fetch orders when the component mounts or when the token changes
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // Fetch orders
    const fetchOrders = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getOrders(token);
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            setError('No se pudieron cargar los pedidos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Refresh orders (for pull-to-refresh)
    const refreshOrders = async () => {
        if (!token) return;

        try {
            setRefreshing(true);
            setError(null);

            const data = await getOrders(token);
            setOrders(data);
        } catch (err) {
            console.error('Failed to refresh orders', err);
            setError('No se pudieron actualizar los pedidos. Por favor, intente de nuevo.');
        } finally {
            setRefreshing(false);
        }
    };

    // Get order by id
    const fetchOrderById = async (id: string): Promise<Order | null> => {
        if (!token) return null;

        try {
            const order = await getOrderById(id, token);
            return order;
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
                loading,
                error,
                refreshing,
                refreshOrders,
                getOrderById: fetchOrderById,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
}