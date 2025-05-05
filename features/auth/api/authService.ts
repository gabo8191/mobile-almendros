import api from '../../../api/axios';
import { User } from '../types/auth.types';

// For demonstration purposes - replace with actual API endpoints
export async function login(cedula: string, password: string): Promise<{ user: User; token: string }> {
    try {
        // Simulate API call
        // In a real app, this would be replaced with an actual API call
        // const response = await api.post('/auth/login', { cedula, password });
        // return response.data;

        // Mock login response for demo
        return await new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful login
                resolve({
                    user: {
                        id: '1',
                        cedula: cedula,
                        name: 'Juan Pérez',
                        email: 'juan.perez@ejemplo.com',
                        phone: '0987654321',
                        address: 'Calle Principal 123, Quito, Ecuador'
                    },
                    token: 'mock-jwt-token-xyz123',
                });
            }, 1000);
        });
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Error durante el inicio de sesión');
    }
}