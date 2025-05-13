export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGIN_CLIENT: '/clients/login',
        SIGNUP: '/auth/signup',
        GET_ROLE: '/auth/role',
    },
    CLIENTS: {
        GET_CLIENT: (id: string) => `/clients/${id}`,
    },
    ORDERS: {
        GET_ALL: '/clients',
        GET_BY_ID: (id: string) => `/clients/${id}`,
    },
    PURCHASES: {
        list: '/customers/purchases',
        detail: (id: string) => `/customers/purchases/${id}`,
        share: (id: string) => `/customers/purchases/${id}/share`
    }
};