import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { User, AuthResponse, DocumentCredentials } from '../types/auth.types';
import { saveItem, getItem, deleteItem, getObject, saveObject, KEYS } from '../../../shared/utils/secureStorage';

/**
 * Autentica un cliente usando tipo y número de documento
 */
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

        console.log('Login response successful');

        // Almacenar token y usuario para sesiones futuras
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

        // Manejo de errores específicos
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.response?.status === 404) {
            throw new Error(`Cliente con documento ${documentType} ${documentNumber} no encontrado o inactivo`);
        } else if (error.response?.status === 401) {
            throw new Error('Documento inválido. Por favor intente nuevamente.');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        } else {
            throw new Error('Error durante el inicio de sesión. Intente nuevamente.');
        }
    }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = async (): Promise<void> => {
    try {
        await deleteItem(KEYS.AUTH_TOKEN);
        await deleteItem(KEYS.AUTH_USER);
        console.log('Session closed successfully');
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Error al cerrar sesión');
    }
};

/**
 * Obtiene el usuario actual desde el almacenamiento
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        return await getObject<User>(KEYS.AUTH_USER);
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

/**
 * Almacena información del usuario
 */
export const storeUser = async (user: User): Promise<void> => {
    try {
        await saveObject(KEYS.AUTH_USER, user);
    } catch (error) {
        console.error('Store user error:', error);
        throw new Error('Error al almacenar información del usuario');
    }
};

/**
 * Verifica si hay una sesión activa
 */
export const hasActiveSession = async (): Promise<boolean> => {
    try {
        const token = await getItem(KEYS.AUTH_TOKEN);
        const user = await getCurrentUser();
        return !!(token && user);
    } catch (error) {
        console.error('Error checking active session:', error);
        return false;
    }
};