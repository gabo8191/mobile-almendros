export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
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
    clientId?: number;
    userId?: string;
};

export interface OrderProduct {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    description?: string;
    imageUrl?: string;
}

export interface OrderDetail extends Order {
    store: string;
    products: OrderProduct[];
    discount?: number;
    deliveryAddress?: string;
    notes?: string;
    client?: {
        id: number;
        name: string;
        email?: string;
        phoneNumber?: string;
    };
    user?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export interface OrdersResponse {
    data: Order[];
    message: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: OrderStatus;
}

export interface ReorderResponse {
    success: boolean;
    message: string;
    orderId?: string;
}