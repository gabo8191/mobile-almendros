export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        GET_ROLE: '/auth/role',
    },
    CLIENTS: {
        GET_CLIENT: (id: string) => `/clients/${id}`,
    },
    ORDERS: {
        // Cambia esto para usar los endpoints de clientes temporalmente
        GET_ALL: '/clients', // En lugar de '/orders'
        GET_BY_ID: (id: string) => `/clients/${id}`, // En lugar de '/orders/:id'
    }
};