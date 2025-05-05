import axiosInstance from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';

export const loginWithDocument = async (documentNumber: string) => {
    try {
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN_MOBILE, {
            documentNumber,
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getClientByDocument = async (documentNumber: string) => {
    try {
        const response = await axiosInstance.get(
            ENDPOINTS.CLIENTS.GET_BY_DOCUMENT(documentNumber)
        );
        return response.data;
    } catch (error) {
        console.error('Get client error:', error);
        throw error;
    }
};