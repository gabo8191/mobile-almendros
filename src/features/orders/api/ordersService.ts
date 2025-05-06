import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Order } from '../types/orders.types';

export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await api.get<{ data: Order[] }>(ENDPOINTS.ORDERS.GET_ALL);
        return response.data.data || [];
    } catch (error) {
        console.error('Get orders error:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los pedidos');
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        const response = await api.get<{ client: Order }>(ENDPOINTS.ORDERS.GET_BY_ID(id));
        return response.data.client;
    } catch (error) {
        console.error('Get order by ID error:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener el pedido');
    }
};