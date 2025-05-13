export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Purchase {
  id: string;
  date: string;
  storeId: string;
  storeName: string;
  total: number;
  paymentMethod: string;
  products: Product[];
  status: 'completed' | 'pending' | 'cancelled';
}

export interface PurchaseListResponse {
  purchases: Purchase[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface PurchaseFilters {
  startDate?: string;
  endDate?: string;
  storeId?: string;
  status?: string;
  page: number;
  limit: number;
}