import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, API_TIMEOUT } from './config';

// Token storage key
const AUTH_TOKEN_KEY = 'auth_token';

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
        // Get token from secure storage
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

        // If token exists, add it to the request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
                    // You might want to redirect to login or refresh token
                    console.error('Authentication error');
                    // Could trigger a logout action here
                    break;
                case 403:
                    // Handle forbidden error
                    console.error('Permission denied');
                    break;
                case 404:
                    // Handle not found error
                    console.error('Resource not found');
                    break;
                case 422:
                    // Validation errors
                    console.error('Validation error', response.data);
                    break;
                case 500:
                    // Handle server error
                    console.error('Server error');
                    break;
                default:
                    // Handle other errors
                    console.error(`Request failed with status: ${response.status}`);
            }
        } else if (error.request) {
            // Handle network errors (no response received)
            console.error('Network error - no response received');
        } else {
            // Handle other errors
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

// Helper to set token
export const setAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
};

// Helper to remove token
export const removeAuthToken = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
};

export default api;