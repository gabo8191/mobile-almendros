import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { LoginCredentials, User, AuthResponse } from '../types/auth.types';
import * as SecureStore from 'expo-secure-store';

export const login = async (cedula: string, password: string): Promise<AuthResponse> => {
    try {
        const credentials: LoginCredentials = {
            cedula,
            password
        };

        const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);

        // Store the token for future requests
        if (response.data.token) {
            await SecureStore.setItemAsync('auth_token', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.message || 'Error durante el inicio de sesión');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Error al cerrar sesión');
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const userJson = await SecureStore.getItemAsync('auth_user');
        if (userJson) {
            return JSON.parse(userJson);
        }
        return null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

export const storeUser = async (user: User): Promise<void> => {
    try {
        await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    } catch (error) {
        console.error('Store user error:', error);
    }
};