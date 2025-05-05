// src/api/axios.ts
import axios from 'axios';
import { getToken, removeToken } from '../shared/utils/secureStorage';

// Set to your actual backend URL - update when deploying
const API_BASE_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
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

// Handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await removeToken();
            // Could redirect to login here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;