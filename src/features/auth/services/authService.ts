import axiosInstance from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';

export type LoginCredentials = {
    documentNumber: string;
};

export const loginWithDocument = async (documentNumber: string) => {
    try {
        // For the mobile app, we need to add a custom endpoint to the backend
        // that can authenticate users with just their document number
        // This endpoint doesn't exist yet in your backend
        const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
            documentNumber,
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Get client by document number
export const getClientByDocument = async (documentNumber: string) => {
    try {
        // This endpoint doesn't exist yet in your backend
        const response = await axiosInstance.get(
            ENDPOINTS.CLIENTS.GET_CLIENT_BY_DOCUMENT(documentNumber)
        );
        return response.data;
    } catch (error) {
        console.error('Get client error:', error);
        throw error;
    }
};