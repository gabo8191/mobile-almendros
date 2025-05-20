import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Order, OrderDetail, OrdersResponse } from '../types/orders.types';

export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await api.get<{ data: Order[] }>(ENDPOINTS.ORDERS.GET_ALL);
        return response.data.data || [];
    } catch (error: any) {
        console.error('Get orders error:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los pedidos');
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        const response = await api.get<{ client: Order }>(ENDPOINTS.ORDERS.GET_BY_ID(id));
        return response.data.client;
    } catch (error: any) {
        console.error('Get order by ID error:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener el pedido');
    }
};

// Añadir nuevos métodos para obtener detalles de compras
export const getOrderDetails = async (orderId: string): Promise<OrderDetail> => {
    try {
        const response = await api.get(`/orders/${orderId}/detail`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
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
        const response = await api.get('/orders/history', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error;
    }
};