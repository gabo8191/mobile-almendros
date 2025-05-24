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
        const response = await api.get(ENDPOINTS.ORDERS.GET_BY_ID(id));
        console.log('Order response successful');
        console.log('Raw response data:', JSON.stringify(response.data, null, 2));

        // Intentar diferentes estructuras de respuesta que el backend podría estar enviando
        let orderData: Order | null = null;

        if (response.data?.client) {
            console.log('Using response.data.client structure');
            orderData = response.data.client;
        }
        else if (response.data?.data) {
            console.log('Using response.data.data structure');
            orderData = response.data.data;
        }
        else if (response.data?.id || response.data?.orderNumber) {
            console.log('Using direct response.data structure');
            orderData = response.data;
        }
        else if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('Using array response.data[0] structure');
            orderData = response.data[0];
        }
        else if (response.data?.orders && Array.isArray(response.data.orders) && response.data.orders.length > 0) {
            console.log('Using response.data.orders[0] structure');
            orderData = response.data.orders[0];
        }

        if (!orderData) {
            console.error('No order data found in response. Response structure:', Object.keys(response.data || {}));
            throw new Error('Estructura de respuesta inesperada del servidor');
        }

        // Validar que tenemos los campos esenciales
        if (!orderData.id && !orderData.orderNumber) {
            console.error('Order data missing essential fields:', orderData);
            throw new Error('Datos del pedido incompletos');
        }

        console.log('Order data extracted successfully:', {
            id: orderData.id,
            orderNumber: orderData.orderNumber,
            status: orderData.status
        });

        return orderData;

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

        throw new Error(error.response?.data?.message || error.message || 'Error al obtener el pedido');
    }
};