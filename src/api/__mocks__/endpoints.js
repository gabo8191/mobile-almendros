// Mock para endpoints API
const mockEndpoints = {
  ENDPOINTS: {
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
    SUPPORT: {
      CONTACT: '/support/contact',
      FAQ: '/support/faq',
      SUBMIT_TICKET: '/support/tickets',
    },
    NOTIFICATIONS: {
      GET_ALL: '/mobile/client/notifications',
      MARK_READ: (id) => `/mobile/client/notifications/${id}/read`,
      MARK_ALL_READ: '/mobile/client/notifications/mark-all-read',
    },
  },
};

module.exports = mockEndpoints.ENDPOINTS;

module.exports.ENDPOINTS = mockEndpoints.ENDPOINTS;
module.exports.default = mockEndpoints.ENDPOINTS;
