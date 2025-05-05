export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
    },
    CLIENTS: {
        GET_CLIENT_BY_DOCUMENT: (documentNumber: string) => `/clients/document/${documentNumber}`,
        GET_CLIENT_ORDERS: (clientId: number) => `/clients/${clientId}/orders`,
    },
};