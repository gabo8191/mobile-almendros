import { Platform } from 'react-native';

let baseUrl = 'http://192.168.20.11:3000/';

if (Platform.OS === 'android') {
    baseUrl = 'http://192.168.20.11:3000/';
}

export const API_BASE_URL = baseUrl;