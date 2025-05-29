export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGIN_CLIENT: '/clients/login',
        SIGNUP: '/auth/signup',
        GET_ROLE: '/auth/role',
        LOGOUT: '/auth/logout',
    },
    CLIENTS: {
        GET_CLIENT: (id: string) => `/clients/${id}`,
        GET_PURCHASE_HISTORY: (id: string) => `/clients/${id}/purchase-history`,
        GET_PURCHASE_REPORT: (id: string) => `/clients/${id}/purchase-report`,
    },
    PURCHASES: {
        // Endpoints para el historial de compras del cliente autenticado
        GET_ALL: '/mobile/client/purchase-history',
        GET_BY_ID: (id: string) => `/mobile/client/purchase-history/${id}`,
    },
    SUPPORT: {
        CONTACT: '/support/contact',
        FAQ: '/support/faq',
        SUBMIT_TICKET: '/support/tickets',
    },
    NOTIFICATIONS: {
        GET_ALL: '/mobile/client/notifications',
        MARK_READ: (id: string) => `/mobile/client/notifications/${id}/read`,
        MARK_ALL_READ: '/mobile/client/notifications/mark-all-read',
    }
};