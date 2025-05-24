import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Order } from '../types/orders.types';

/**
 * Obtiene todos los pedidos del cliente autenticado
 */
export const getOrders = async (): Promise<Order[]> => {
    try {
        console.log('Getting orders from:', ENDPOINTS.ORDERS.GET_ALL);
        const response = await api.get<{ data: Order[] }>(ENDPOINTS.ORDERS.GET_ALL);
        console.log('Orders response successful, count:', response.data.data?.length || 0);
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
        } else if (error.response?.status === 403) {
            throw new Error('No tiene permisos para ver los pedidos');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener los pedidos');
    }
};

/**
 * Obtiene un pedido específico por su ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
    try {
        console.log('Getting order by id:', id);
        const response = await api.get<{ client: Order }>(ENDPOINTS.ORDERS.GET_BY_ID(id));
        console.log('Order response successful');
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
        } else if (error.response?.status === 404) {
            throw new Error('Pedido no encontrado');
        } else if (error.response?.status === 403) {
            throw new Error('No tiene permisos para ver este pedido');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener el pedido');
    }
};