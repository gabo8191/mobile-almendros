const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGIN_CLIENT: '/clients/login',
    SIGNUP: '/auth/signup',
    GET_ROLE: '/auth/role',
    LOGOUT: '/auth/logout',
  },
  CLIENTS: {
    GET_CLIENT: (id) => `/clients/${id}`,
    GET_PURCHASE_HISTORY: (id) => `/clients/${id}/purchase-history`,
    GET_PURCHASE_REPORT: (id) => `/clients/${id}/purchase-report`,
  },
  PURCHASES: {
    GET_ALL: '/mobile/client/purchase-history',
    GET_BY_ID: (id) => `/mobile/client/purchase-history/${id}`,
  },
  MOBILE: {
    GET_ORDERS: '/mobile/client/orders',
    GET_ORDER_BY_ID: (id) => `/mobile/client/orders/${id}`,
    GET_PURCHASE_HISTORY: '/mobile/client/purchase-history',
    GET_PURCHASE_BY_ID: (id) => `/mobile/client/purchase-history/${id}`,
  },
};

// Log para debug
console.log('🔧 Loading mock endpoints');

// Exportaciones múltiples para compatibilidad
module.exports = { ENDPOINTS };
module.exports.ENDPOINTS = ENDPOINTS;
module.exports.default = { ENDPOINTS };

// Para compatibilidad con import/export
module.exports.__esModule = true;
