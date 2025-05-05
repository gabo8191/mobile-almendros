import { createContext, useState, useEffect, ReactNode } from 'react';
import { getOrders, getOrderById, cancelOrder } from '../api/ordersService';
import { Order } from '../types/orders.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

type OrdersContextType = {
    orders: Order[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    refreshOrders: () => Promise<void>;
    getOrderById: (id: string) => Promise<Order>;
    cancelOrder: (id: string) => Promise<boolean>;
};

export const OrdersContext = createContext<OrdersContextType>({
    orders: [],
    loading: false,
    error: null,
    refreshing: false,
    refreshOrders: async () => { },
    getOrderById: async () => {
        throw new Error('Not implemented');
    },
    cancelOrder: async () => {
        throw new Error('Not implemented');
    },
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
    const fetchOrderById = async (id: string): Promise<Order> => {
        try {
            const result = await getOrderById(id, token || undefined);
            return result;
        } catch (err) {
            console.error('Failed to fetch order', err);
            setError('No se pudo cargar el pedido. Por favor, intente de nuevo.');
            throw err;
        }
    };

    // Cancel order
    const handleCancelOrder = async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const success = await cancelOrder(id, token || undefined);

            // Refresh the orders list if cancellation was successful
            if (success) {
                await fetchOrders();
            }

            return success;
        } catch (err) {
            console.error('Failed to cancel order', err);
            setError('No se pudo cancelar el pedido. Por favor, intente de nuevo.');
            throw err;
        } finally {
            setLoading(false);
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
                cancelOrder: handleCancelOrder,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
}