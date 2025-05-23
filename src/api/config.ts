import config from '../config';

export const API_BASE_URL = config.api.baseUrl.replace(/\/$/, '');
export const API_TIMEOUT = config.api.timeout;