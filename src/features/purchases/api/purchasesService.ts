import api from '../../../api/axios';
import { ENDPOINTS } from '../../../api/endpoints';
import { Purchase, PurchaseDetail } from '../types/purchases.types';
import { getObject, KEYS } from '../../../shared/utils/secureStorage';
import { User } from '../../../features/auth/types/auth.types';

/**
 * Obtiene el cliente autenticado actual
 */
async function getCurrentClient(): Promise<User | null> {
    try {
        return await getObject<User>(KEYS.AUTH_USER);
    } catch (error) {
        console.error('Error obteniendo cliente actual:', error);
        return null;
    }
}

/**
 * Mapea los datos del backend (MobileOrder) al formato esperado por el frontend (Purchase)
 */
function mapBackendToPurchase(backendData: any): Purchase {
    return {
        id: backendData.id,
        purchaseNumber: backendData.orderNumber, // Mapeo: orderNumber -> purchaseNumber
        date: backendData.date,
        status: backendData.status || 'completed',
        items: backendData.items || [],
        subtotal: backendData.subtotal || 0,
        tax: backendData.tax || 0,
        shipping: backendData.shipping || 0,
        total: backendData.total,
        address: backendData.address || '',
        paymentMethod: backendData.paymentMethod || 'Cash',
    };
}

/**
 * Obtiene todas las compras del cliente autenticado
 */
export const getPurchases = async (): Promise<Purchase[]> => {
    try {
        // Obtener el cliente autenticado
        const currentClient = await getCurrentClient();
        if (!currentClient || !currentClient.id) {
            throw new Error('No hay cliente autenticado');
        }

        const clientId = parseInt(currentClient.id);
        if (isNaN(clientId)) {
            throw new Error('ID de cliente inválido');
        }

        console.log('Obteniendo compras para clientId:', clientId);
        console.log('Endpoint:', ENDPOINTS.PURCHASES.GET_ALL);

        // Enviar clientId como query parameter requerido por MobileOrderDto
        const response = await api.get<{ data: any[] }>(ENDPOINTS.PURCHASES.GET_ALL, {
            params: {
                clientId: clientId,
                page: 1,
                limit: 50 // Obtener todas las compras
            }
        });

        console.log('Respuesta de compras exitosa, cantidad:', response.data.data?.length || 0);

        // Mapear los datos del backend al formato del frontend
        const purchases = (response.data.data || []).map(mapBackendToPurchase);
        return purchases;
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
        } else if (error.response?.status === 400) {
            // Error de validación
            const details = error.response?.data?.details;
            if (details && Array.isArray(details)) {
                throw new Error(`Error de validación: ${details.join(', ')}`);
            }
            throw new Error('Datos de solicitud inválidos');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || 'Error al obtener las compras');
    }
};

/**
 * Obtiene una compra específica por su ID
 */
export const getPurchaseById = async (id: string): Promise<PurchaseDetail> => {
    try {
        // Obtener el cliente autenticado
        const currentClient = await getCurrentClient();
        if (!currentClient || !currentClient.id) {
            throw new Error('No hay cliente autenticado');
        }

        const clientId = parseInt(currentClient.id);
        if (isNaN(clientId)) {
            throw new Error('ID de cliente inválido');
        }

        console.log('Obteniendo compra por id:', id, 'para clientId:', clientId);

        // El endpoint para obtener una compra específica debería ser diferente
        // Usar el endpoint de purchase history con filtro por purchaseId
        const response = await api.get(ENDPOINTS.PURCHASES.GET_BY_ID(id), {
            params: {
                clientId: clientId
            }
        });

        console.log('Respuesta de compra exitosa');
        console.log('Datos de la respuesta:', JSON.stringify(response.data, null, 2));

        // Intentar diferentes estructuras de respuesta que el backend podría estar enviando
        let purchaseData: any | null = null;

        if (response.data?.data) {
            console.log('Usando estructura response.data.data');
            purchaseData = response.data.data;
        }
        else if (response.data?.id || response.data?.orderNumber) {
            console.log('Usando estructura directa response.data');
            purchaseData = response.data;
        }
        else if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('Usando estructura de array response.data[0]');
            purchaseData = response.data[0];
        }

        if (!purchaseData) {
            console.error('No se encontraron datos de compra en la respuesta. Estructura de respuesta:', Object.keys(response.data || {}));
            throw new Error('Estructura de respuesta inesperada del servidor');
        }

        // Validar que tenemos los campos esenciales
        if (!purchaseData.id && !purchaseData.orderNumber) {
            console.error('Datos de compra sin campos esenciales:', purchaseData);
            throw new Error('Datos de la compra incompletos');
        }

        console.log('Datos de compra extraídos exitosamente:', {
            id: purchaseData.id,
            orderNumber: purchaseData.orderNumber,
            total: purchaseData.total
        });

        // Mapear y devolver como PurchaseDetail
        const mappedPurchase = mapBackendToPurchase(purchaseData);
        return {
            ...mappedPurchase,
            store: purchaseData.store || 'Almendros',
            discount: purchaseData.discount || 0,
        } as PurchaseDetail;

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
        } else if (error.response?.status === 400) {
            // Error de validación
            const details = error.response?.data?.details;
            if (details && Array.isArray(details)) {
                throw new Error(`Error de validación: ${details.join(', ')}`);
            }
            throw new Error('Datos de solicitud inválidos');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            throw new Error('Error de conexión. Verifique su red e intente nuevamente.');
        }

        throw new Error(error.response?.data?.message || error.message || 'Error al obtener la compra');
    }
};