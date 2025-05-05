import axiosInstance from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';

export const getClientOrders = async (clientId: number) => {
    try {
        const response = await axiosInstance.get(
            ENDPOINTS.CLIENTS.GET_ORDERS(clientId)
        );
        return response.data;
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
};