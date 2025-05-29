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
    items: PurchaseItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
};

// Para futuras implementaciones de paginación
export interface PurchasesResponse {
    data: Purchase[];
    totalPurchases: number;
    totalPages: number;
    currentPage: number;
}