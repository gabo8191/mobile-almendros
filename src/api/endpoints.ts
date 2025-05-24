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
    ORDERS: {
        // Endpoints para clientes
        GET_ALL: '/mobile/client/orders',
        GET_BY_ID: (id: string) => `/mobile/client/orders/${id}`,
        REORDER: (id: string) => `/mobile/client/orders/${id}/reorder`,

        // Endpoints para el historial de compras del cliente actual
        GET_PURCHASE_HISTORY: '/mobile/client/purchase-history',

        CANCEL_ORDER: (id: string) => `/mobile/client/orders/${id}/cancel`,
        TRACK_ORDER: (id: string) => `/mobile/client/orders/${id}/track`,
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