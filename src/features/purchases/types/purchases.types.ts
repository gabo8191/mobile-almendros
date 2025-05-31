export type PurchaseItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
};

export type Purchase = {
    id: string;
    purchaseNumber: string;
    date: string;
    status: 'completed' | 'pending' | 'cancelled';
    items: PurchaseItem[];
    subtotal: number;
    tax: number;
    shipping?: number;
    total: number;
    address?: string;
    paymentMethod: string;
};

export type PurchaseDetail = Purchase & {
    store?: string;
    discount?: number;
};

// Para futuras implementaciones de paginación
export interface PurchasesResponse {
    data: Purchase[];
    totalPurchases: number;
    totalPages: number;
    currentPage: number;
}