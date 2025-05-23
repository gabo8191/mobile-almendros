import axios from 'axios';
import { getItem, KEYS } from '../shared/utils/secureStorage';
import { API_BASE_URL, API_TIMEOUT } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: API_TIMEOUT,
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getItem(KEYS.AUTH_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Token added to request:', token.substring(0, 20) + '...');
            } else {
                console.log('No token found in storage');
            }
        } catch (error) {
            console.error('Error getting token from storage:', error);
        }

        // Safe logging with null checks
        const baseUrl = config.baseURL || 'Unknown base URL';
        const url = config.url || 'Unknown URL';
        console.log('Making request to:', baseUrl + url);
        console.log('Request headers:', config.headers);

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        const url = response.config?.url || 'Unknown URL';
        console.log('Response received:', response.status, url);
        return response;
    },
    (error) => {
        const { response, request } = error;

        console.error('Response error:', {
            status: response?.status,
            statusText: response?.statusText,
            data: response?.data,
            url: request?.responseURL || response?.config?.url || 'Unknown URL'
        });

        if (response) {
            switch (response.status) {
                case 401:
                    console.error('Authentication error - redirecting to login');
                    // You could redirect to login here if needed
                    break;
                case 403:
                    console.error('Permission denied');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error(`Request failed with status: ${response.status}`);
            }
        } else if (request) {
            console.error('Network error - no response received');
        } else {
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;