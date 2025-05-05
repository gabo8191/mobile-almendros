import axiosInstance from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';

export type Order = {
    id: number;
    date: string;
    status: string;
    total: number;
    items: OrderItem[];
};

export type OrderItem = {
    id: number;
    product: string;
    quantity: number;
    price: number;
    subtotal: number;
};

export const getClientOrders = async (clientId: number) => {
    try {
        // This endpoint doesn't exist yet in your backend
        const response = await axiosInstance.get(
            ENDPOINTS.CLIENTS.GET_CLIENT_ORDERS(clientId)
        );
        return response.data;
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
};