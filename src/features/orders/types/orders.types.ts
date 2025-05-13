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

export interface OrderProduct {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    imageUrl?: string;
}

export interface OrderDetail extends Order {
    store: string;
    paymentMethod: string;
    products: OrderProduct[];
    subtotal: number;
    tax: number;
    discount?: number;
    deliveryAddress?: string;
}

export interface OrdersResponse {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
}