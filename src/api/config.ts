import { Platform } from 'react-native';

let baseUrl = 'http://localhost:3000/';

if (Platform.OS === 'android') {
    baseUrl = 'http://10.0.2.2:3000/';
}

export const API_BASE_URL = baseUrl;