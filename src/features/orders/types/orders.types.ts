export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    orderNumber: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    address: string;
    paymentMethod: string;
};