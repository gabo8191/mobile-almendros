import axios from 'axios';
import { getToken, removeToken } from '../shared/utils/secureStorage';

// Base URL should point to your backend server
const API_BASE_URL = 'http://your-backend-url.com'; // Change to your actual backend URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles global error responses
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized errors - clear token and redirect to login
        if (error.response?.status === 401) {
            await removeToken();
            // You'll implement navigation to login later
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;