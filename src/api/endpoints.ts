export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGIN_MOBILE: '/auth/login-mobile',
    },
    CLIENTS: {
        GET_BY_DOCUMENT: (documentNumber: string) => `/clients/document/${documentNumber}`,
        GET_ORDERS: (clientId: number) => `/clients/${clientId}/orders`,
    },
};