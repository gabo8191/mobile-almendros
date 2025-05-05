import axios from 'axios';

// Base API URL
const baseURL = 'https://api.example.com';

// Create axios instance
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can modify the request config here
        // For example, add authentication token from secure storage
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // You can modify the response data here
        return response;
    },
    (error) => {
        // Handle error responses
        const { response } = error;

        if (response) {
            // Handle specific HTTP error codes
            switch (response.status) {
                case 401:
                    // Handle unauthorized error (e.g., redirect to login)
                    console.error('Authentication error');
                    break;
                case 403:
                    // Handle forbidden error
                    console.error('Permission denied');
                    break;
                case 404:
                    // Handle not found error
                    console.error('Resource not found');
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

export default api;