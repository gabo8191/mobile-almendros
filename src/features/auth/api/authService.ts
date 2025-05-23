import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { LoginCredentials, User, AuthResponse, DocumentCredentials } from '../types/auth.types';
import { saveItem, getItem, deleteItem, getObject, saveObject, KEYS } from '../../../shared/utils/secureStorage';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const credentials: LoginCredentials = {
            email,
            password
        };

        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
        console.log('Using endpoint:', ENDPOINTS.AUTH.LOGIN);
        console.log('Full URL:', api.defaults.baseURL + ENDPOINTS.AUTH.LOGIN);

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
        const credentials: DocumentCredentials = {
            documentType,
            documentNumber
        };

        console.log('Login attempt with:', credentials);
        console.log('Endpoint:', ENDPOINTS.AUTH.LOGIN_CLIENT);
        console.log('Full URL:', api.defaults.baseURL + ENDPOINTS.AUTH.LOGIN_CLIENT);

        const response = await api.post<AuthResponse>(
            ENDPOINTS.AUTH.LOGIN_CLIENT,
            credentials,
            {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Login response:', response.data);

        // Store the token for future requests
        if (response.data.token) {
            await saveItem(KEYS.AUTH_TOKEN, response.data.token);
            await saveObject(KEYS.AUTH_USER, response.data.user);
        }

        return response.data;
    } catch (error: any) {
        console.error('Login error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method
        });

        // Re-throw the error with better message handling
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.response?.status === 404) {
            throw new Error(`Cliente con documento ${documentType} ${documentNumber} no encontrado o inactivo`);
        } else if (error.response?.status === 401) {
            throw new Error('Documento inválido. Por favor intente nuevamente.');
        } else {
            throw new Error('Error durante el inicio de sesión. Verifique su conexión.');
        }
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