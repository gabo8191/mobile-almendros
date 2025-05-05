import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, API_TIMEOUT } from './config';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: API_TIMEOUT,
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Add auth token if available
        try {
            const authStateJson = await SecureStore.getItemAsync('auth_state');
            if (authStateJson) {
                const authState = JSON.parse(authStateJson);
                if (authState.token) {
                    config.headers.Authorization = `Bearer ${authState.token}`;
                }
            }
        } catch (error) {
            console.error('Error getting auth token:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle error responses
        const { response } = error;

        if (response) {
            // Handle specific HTTP error codes
            switch (response.status) {
                case 401:
                    // Handle unauthorized error
                    console.error('Autenticación fallida');
                    // You might want to redirect to login here
                    break;
                case 403:
                    // Handle forbidden error
                    console.error('Permiso denegado');
                    break;
                case 404:
                    // Handle not found error
                    console.error('Recurso no encontrado');
                    break;
                case 500:
                    // Handle server error
                    console.error('Error del servidor');
                    break;
                default:
                    // Handle other errors
                    console.error(`Petición fallida con estado: ${response.status}`);
            }
        } else if (error.request) {
            // Handle network errors (no response received)
            console.error('Error de red - No se recibió respuesta');
        } else {
            // Handle other errors
            console.error('Error configurando la petición:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;