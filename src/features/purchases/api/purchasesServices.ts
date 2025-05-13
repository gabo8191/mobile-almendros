import axios from '../../../api/axios';
import { Purchase, PurchaseListResponse, PurchaseFilters } from '../types/purchases.types';
import { ENDPOINTS } from '../../../api/endpoints';

/**
 * Servicio para gestionar las operaciones relacionadas con compras
 */
export const purchasesService = {
    /**
     * Obtiene el listado de compras del cliente
     * @param filters Filtros para la consulta
     * @returns Listado de compras paginado
     */
    getPurchases: async (filters: PurchaseFilters): Promise<PurchaseListResponse> => {
        const response = await axios.get(ENDPOINTS.PURCHASES.list, { params: filters });
        return response.data;
    },

    /**
     * Obtiene el detalle de una compra específica
     * @param purchaseId ID de la compra
     * @returns Detalle completo de la compra
     */
    getPurchaseDetail: async (purchaseId: string): Promise<Purchase> => {
        const response = await axios.get(ENDPOINTS.PURCHASES.detail(purchaseId));
        return response.data;
    },

    /**
     * Comparte el comprobante de una compra
     * @param purchaseId ID de la compra
     * @returns URL del comprobante para compartir
     */
    sharePurchaseReceipt: async (purchaseId: string): Promise<{ shareUrl: string }> => {
        const response = await axios.post(ENDPOINTS.PURCHASES.share(purchaseId));
        return response.data;
    }
};