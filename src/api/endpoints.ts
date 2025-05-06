export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
    },
    CLIENTS: {
        GET_CLIENT: (id: string) => `/clients/${id}`,
    },
    ORDERS: {
        GET_ALL: '/orders',
        GET_BY_ID: (id: string) => `/orders/${id}`,
    }
};