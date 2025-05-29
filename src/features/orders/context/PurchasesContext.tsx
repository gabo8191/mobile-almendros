import React, { createContext, useState, useEffect, useContext } from 'react';
import { getPurchases, getPurchaseById } from '../api/purchasesService';
import { Purchase } from '../types/purchases.types';
import { useAuth } from '../../../shared/context/AuthContext';

type PurchasesContextType = {
  purchases: Purchase[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshPurchases: () => Promise<void>;
  getPurchaseById: (id: string) => Promise<Purchase | null>;
  clearError: () => void;
};

const PurchasesContext = createContext<PurchasesContextType>({
  purchases: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  refreshPurchases: async () => {},
  getPurchaseById: async () => null,
  clearError: () => {},
});

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();

  // Limpiar errores manualmente
  const clearError = () => {
    setError(null);
  };

  // Obtener compras cuando el usuario esté autenticado
  useEffect(() => {
    console.log('PurchasesProvider useEffect:', { user: !!user, authLoading });

    if (!authLoading && user) {
      console.log('Usuario autenticado, obteniendo compras...');
      fetchPurchases();
    } else if (!authLoading && !user) {
      console.log('No hay usuario autenticado, limpiando compras');
      setPurchases([]);
      setError(null);
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchPurchases = async () => {
    if (!user) {
      console.log('No hay usuario, omitiendo obtención de compras');
      return;
    }

    try {
      console.log('Obteniendo compras para usuario:', user.documentType, user.documentNumber);
      setIsLoading(true);
      setError(null);

      const data = await getPurchases();
      console.log('Compras obtenidas exitosamente, cantidad:', data.length);
      setPurchases(data);
    } catch (err: any) {
      console.error('Error al obtener compras:', err);

      let errorMessage = 'No se pudieron cargar las compras.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPurchases = async () => {
    if (!user) {
      console.log('No hay usuario, omitiendo actualización de compras');
      return;
    }

    try {
      console.log('Actualizando compras...');
      setIsRefreshing(true);
      setError(null);

      const data = await getPurchases();
      console.log('Compras actualizadas exitosamente, cantidad:', data.length);
      setPurchases(data);
    } catch (err: any) {
      console.error('Error al actualizar compras:', err);

      let errorMessage = 'No se pudieron actualizar las compras.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchPurchaseById = async (id: string): Promise<Purchase | null> => {
    if (!user) {
      console.log('No hay usuario, omitiendo obtención de compra por id');
      return null;
    }

    try {
      console.log('Obteniendo compra por id:', id);
      const purchase = await getPurchaseById(id);
      console.log('Compra obtenida exitosamente:', purchase.purchaseNumber);
      return purchase;
    } catch (err: any) {
      console.error('Error al obtener compra:', err);

      let errorMessage = 'No se pudo cargar la compra.';
      if (err.message === 'Unauthorized') {
        errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente.';
      } else if (err.message === 'Compra no encontrada') {
        errorMessage = 'La compra solicitada no fue encontrada.';
      } else if (err.message.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifique su red e intente nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    }
  };

  return (
    <PurchasesContext.Provider
      value={{
        purchases,
        isLoading,
        isRefreshing,
        error,
        refreshPurchases,
        getPurchaseById: fetchPurchaseById,
        clearError,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => useContext(PurchasesContext);
