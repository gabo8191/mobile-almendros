import api from '@/api/axios';
import { Order } from '../types/orders.types';

// Mock orders data for demo purposes
const mockOrders: Order[] = [
    {
        id: '1',
        orderNumber: '10001',
        date: new Date('2023-09-15').toISOString(),
        status: 'completed',
        items: [
            { id: '1', name: 'Camisa de algodón', quantity: 2, price: 25.99 },
            { id: '2', name: 'Pantalón vaquero', quantity: 1, price: 45.50 },
        ],
        subtotal: 97.48,
        tax: 11.70,
        shipping: 5.99,
        total: 115.17,
        address: 'Calle Principal 123, Quito',
        paymentMethod: 'Tarjeta de crédito'
    },
    {
        id: '2',
        orderNumber: '10002',
        date: new Date('2023-10-05').toISOString(),
        status: 'processing',
        items: [
            { id: '3', name: 'Zapatillas deportivas', quantity: 1, price: 89.99 },
        ],
        subtotal: 89.99,
        tax: 10.80,
        shipping: 0,
        total: 100.79,
        address: 'Av. Principal 456, Guayaquil',
        paymentMethod: 'PayPal'
    },
    {
        id: '3',
        orderNumber: '10003',
        date: new Date('2023-10-20').toISOString(),
        status: 'pending',
        items: [
            { id: '4', name: 'Reloj inteligente', quantity: 1, price: 129.99 },
            { id: '5', name: 'Auriculares inalámbricos', quantity: 1, price: 79.99 },
        ],
        subtotal: 209.98,
        tax: 25.20,
        shipping: 3.99,
        total: 239.17,
        address: 'Plaza Central 789, Cuenca',
        paymentMethod: 'Transferencia bancaria'
    },
    {
        id: '4',
        orderNumber: '10004',
        date: new Date('2023-11-10').toISOString(),
        status: 'cancelled',
        items: [
            { id: '6', name: 'Tablet 10 pulgadas', quantity: 1, price: 299.99 },
        ],
        subtotal: 299.99,
        tax: 36.00,
        shipping: 0,
        total: 335.99,
        address: 'Calle Secundaria 321, Quito',
        paymentMethod: 'Tarjeta de débito'
    },
    {
        id: '5',
        orderNumber: '10005',
        date: new Date().toISOString(),
        status: 'processing',
        items: [
            { id: '7', name: 'Mochila resistente al agua', quantity: 1, price: 45.99 },
            { id: '8', name: 'Botella de agua 1L', quantity: 2, price: 12.50 },
        ],
        subtotal: 70.99,
        tax: 8.52,
        shipping: 4.99,
        total: 84.50,
        address: 'Av. Costera 567, Manta',
        paymentMethod: 'Efectivo contra entrega'
    },
];

// For demonstration purposes - replace with actual API endpoints
export async function getOrders(token: string): Promise<Order[]> {
    try {
        // Simulate API call
        // In a real app, this would be replaced with an actual API call
        // const response = await api.get('/orders', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // return response.data;

        // Mock orders response for demo
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockOrders);
            }, 1000);
        });
    } catch (error) {
        console.error('Get orders error:', error);
        throw new Error('Error al obtener los pedidos');
    }
}

export async function getOrderById(id: string, token?: string): Promise<Order> {
    try {
        // Simulate API call
        // In a real app, this would be replaced with an actual API call
        // const response = await api.get(`/orders/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // return response.data;

        // Mock order detail response for demo
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                const order = mockOrders.find(order => order.id === id);
                if (order) {
                    resolve(order);
                } else {
                    reject(new Error('Pedido no encontrado'));
                }
            }, 800);
        });
    } catch (error) {
        console.error('Get order by ID error:', error);
        throw new Error('Error al obtener el pedido');
    }
}

export async function cancelOrder(id: string, token?: string): Promise<boolean> {
    try {
        // Simulate API call
        // In a real app, this would be replaced with an actual API call
        // const response = await api.put(`/orders/${id}/cancel`, {}, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // return response.data;

        // Mock cancel order response for demo
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                const orderIndex = mockOrders.findIndex(order => order.id === id);
                if (orderIndex !== -1) {
                    // Check if the order can be cancelled
                    const order = mockOrders[orderIndex];
                    if (order.status === 'pending' || order.status === 'processing') {
                        // Update the mock data
                        mockOrders[orderIndex] = {
                            ...order,
                            status: 'cancelled'
                        };
                        resolve(true);
                    } else {
                        reject(new Error('Este pedido no puede ser cancelado'));
                    }
                } else {
                    reject(new Error('Pedido no encontrado'));
                }
            }, 1000);
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        throw new Error('Error al cancelar el pedido');
    }
}