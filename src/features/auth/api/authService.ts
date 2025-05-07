import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { LoginCredentials, User, AuthResponse } from '../types/auth.types';
import { saveItem, getItem, deleteItem, getObject, saveObject, KEYS } from '../../../shared/utils/secureStorage';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const credentials: LoginCredentials = {
            email,
            password
        };

        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);

        // Store the token for future requests
        if (response.data.token) {
            await saveItem(KEYS.AUTH_TOKEN, response.data.token);
            await saveObject(KEYS.AUTH_USER, response.data.user);
        }

        return response.data;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.message || 'Error durante el inicio de sesión');
    }
};

export const loginWithDocument = async (documentType: string, documentNumber: string): Promise<AuthResponse> => {
    try {
        const credentials = {
            documentType,
            documentNumber
        };

        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN_CLIENT, credentials);

        // Store the token for future requests
        if (response.data.token) {
            await saveItem(KEYS.AUTH_TOKEN, response.data.token);
            await saveObject(KEYS.AUTH_USER, response.data.user);
        }

        return response.data;
    } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.message || 'Error durante el inicio de sesión');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await deleteItem(KEYS.AUTH_TOKEN);
        await deleteItem(KEYS.AUTH_USER);
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Error al cerrar sesión');
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        return await getObject<User>(KEYS.AUTH_USER);
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

export const storeUser = async (user: User): Promise<void> => {
    try {
        await saveObject(KEYS.AUTH_USER, user);
    } catch (error) {
        console.error('Store user error:', error);
    }
};