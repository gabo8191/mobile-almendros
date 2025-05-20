import axios from 'axios';
import { getItem, KEYS } from '../shared/utils/secureStorage';
import { API_BASE_URL, API_TIMEOUT } from './config';

// Create axios instance
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
        const token = await getItem(KEYS.AUTH_TOKEN);
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
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    // Handle unauthorized error
                    console.error('Authentication error');
                    // You could redirect to login here
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
        } else if (error.request) {
            console.error('Network error - no response received');
        } else {
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;