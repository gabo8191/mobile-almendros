import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Order, OrderDetail, OrdersResponse } from '../types/orders.types';

export const getOrders = async (): Promise<Order[]> => {
    try {
        console.log('Getting orders from:', ENDPOINTS.ORDERS.GET_ALL);
        const response = await api.get<{ data: Order[] }>(ENDPOINTS.ORDERS.GET_ALL);
        console.log('Orders response:', response.data);
        return response.data.data || [];
    } catch (error: any) {
        console.error('Get orders error:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener los pedidos');
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        console.log('Getting order by id:', id);
        const response = await api.get<{ client: Order }>(ENDPOINTS.ORDERS.GET_BY_ID(id));
        console.log('Order response:', response.data);
        return response.data.client;
    } catch (error: any) {
        console.error('Get order by ID error:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener el pedido');
    }
};

// Añadir nuevos métodos para obtener detalles de compras
export const getOrderDetails = async (orderId: string): Promise<OrderDetail> => {
    try {
        console.log('Getting order details for:', orderId);
        const response = await api.get(`/orders/${orderId}/detail`);
        console.log('Order details response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching order details:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw error;
    }
};

// Método para obtener historial de compras con filtros
export const getOrderHistory = async (
    params: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
    } = {}
): Promise<OrdersResponse> => {
    try {
        console.log('Getting order history with params:', params);
        const response = await api.get('/orders/history', { params });
        console.log('Order history response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching order history:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw error;
    }
};