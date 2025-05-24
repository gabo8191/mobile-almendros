import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Order, OrderDetail, OrdersResponse } from '../types/orders.types';

export const getOrders = async (): Promise<Order[]> => {
    try {
        console.log('Getting orders from:', ENDPOINTS.ORDERS.GET_ALL);
        const response = await api.get<{ data: Order[]; message: string }>(ENDPOINTS.ORDERS.GET_ALL);
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

export const getOrderById = async (id: string): Promise<Order | null> => {
    try {
        console.log('Getting order by id:', id);
        const response = await api.get<{ data: Order; message: string }>(ENDPOINTS.ORDERS.GET_BY_ID(id));
        console.log('Order response:', response.data);
        return response.data.data;
    } catch (error: any) {
        console.error('Get order by ID error:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 404) {
            return null; // Order not found
        }

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener el pedido');
    }
};

// Método mejorado para obtener detalles completos de una orden
export const getOrderDetails = async (orderId: string): Promise<OrderDetail | null> => {
    try {
        console.log('Getting detailed order for:', orderId);
        const response = await api.get<{ data: OrderDetail; message: string }>(ENDPOINTS.ORDERS.GET_BY_ID(orderId));
        console.log('Order details response:', response.data);

        // El backend ya devuelve la información en el formato correcto
        const orderData = response.data.data;

        // Transformar si es necesario para agregar campos adicionales
        const orderDetail: OrderDetail = {
            ...orderData,
            store: 'Almendros', // Nombre de la tienda
            paymentMethod: orderData.paymentMethod || 'Efectivo',
            products: (orderData.items || []).map((item: any) => ({
                ...item,
                unitPrice: item.unitPrice ?? 0,
                subtotal: item.subtotal ?? (item.unitPrice && item.quantity ? item.unitPrice * item.quantity : 0),
            })), // Mapear items a products asegurando las propiedades requeridas
        };

        return orderDetail;
    } catch (error: any) {
        console.error('Error fetching order details:', error);

        if (error.response?.status === 404) {
            return null; // Order not found
        }

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener los detalles del pedido');
    }
};

// Método para obtener historial de compras con filtros y paginación
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
        const response = await api.get<OrdersResponse>(ENDPOINTS.ORDERS.GET_ALL, { params });
        console.log('Order history response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching order history:', error);

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener el historial de pedidos');
    }
};

// Método para reordenar (crear una nueva orden basada en una existente)
export const reorderItems = async (orderId: string): Promise<{ success: boolean; message: string; orderId?: string }> => {
    try {
        console.log('Reordering items from order:', orderId);
        const response = await api.post(`/mobile/client/orders/${orderId}/reorder`);
        console.log('Reorder response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error reordering:', error);
        throw new Error(error.response?.data?.message || 'Error al reordenar los productos');
    }
};