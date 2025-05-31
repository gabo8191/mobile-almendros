import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Purchase } from '../types/purchases.types';

/**
 * Obtiene todas las compras del cliente autenticado
 */
export const getPurchases = async (): Promise<Purchase[]> => {
    try {
        console.log('Obteniendo compras desde:', ENDPOINTS.PURCHASES.GET_ALL);
        const response = await api.get<{ data: Purchase[] }>(ENDPOINTS.PURCHASES.GET_ALL);
        console.log('Respuesta de compras exitosa, cantidad:', response.data.data?.length || 0);
        return response.data.data || [];
    } catch (error: any) {
        console.error('Error al obtener compras:', error);
        console.error('Detalles del error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        } else if (error.response?.status === 403) {
            throw new Error('No tiene permisos para ver las compras');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener las compras');
    }
};

/**
 * Obtiene una compra específica por su ID
 */
export const getPurchaseById = async (id: string): Promise<Purchase> => {
    try {
        console.log('Obteniendo compra por id:', id);
        const response = await api.get(ENDPOINTS.PURCHASES.GET_BY_ID(id));
        console.log('Respuesta de compra exitosa');
        console.log('Datos de la respuesta:', JSON.stringify(response.data, null, 2));

        // Intentar diferentes estructuras de respuesta que el backend podría estar enviando
        let purchaseData: Purchase | null = null;

        if (response.data?.client) {
            console.log('Usando estructura response.data.client');
            purchaseData = response.data.client;
        }
        else if (response.data?.data) {
            console.log('Usando estructura response.data.data');
            purchaseData = response.data.data;
        }
        else if (response.data?.id || response.data?.purchaseNumber) {
            console.log('Usando estructura directa response.data');
            purchaseData = response.data;
        }
        else if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('Usando estructura de array response.data[0]');
            purchaseData = response.data[0];
        }
        else if (response.data?.purchases && Array.isArray(response.data.purchases) && response.data.purchases.length > 0) {
            console.log('Usando estructura response.data.purchases[0]');
            purchaseData = response.data.purchases[0];
        }

        if (!purchaseData) {
            console.error('No se encontraron datos de compra en la respuesta. Estructura de respuesta:', Object.keys(response.data || {}));
            throw new Error('Estructura de respuesta inesperada del servidor');
        }

        // Validar que tenemos los campos esenciales
        if (!purchaseData.id && !purchaseData.purchaseNumber) {
            console.error('Datos de compra sin campos esenciales:', purchaseData);
            throw new Error('Datos de la compra incompletos');
        }

        console.log('Datos de compra extraídos exitosamente:', {
            id: purchaseData.id,
            purchaseNumber: purchaseData.purchaseNumber,
            total: purchaseData.total
        });

        return purchaseData;

    } catch (error: any) {
        console.error('Error al obtener compra por ID:', error);
        console.error('Detalles del error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            throw new Error('Unauthorized');
        } else if (error.response?.status === 404) {
            throw new Error('Compra no encontrada');
        } else if (error.response?.status === 403) {
            throw new Error('No tiene permisos para ver esta compra');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || error.message || 'Error al obtener la compra');
    }
};