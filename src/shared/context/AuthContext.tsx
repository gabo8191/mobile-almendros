import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { router, useSegments } from 'expo-router';
import { Platform } from 'react-native';
import { User } from '../../features/auth/types/auth.types';
import {
  logout as logoutApi,
  getCurrentUser,
  storeUser,
  loginWithDocument as loginWithDocumentApi,
  hasActiveSession,
} from '../../features/auth/api/authService';
import { deleteItem, KEYS, saveItem } from '../../shared/utils/secureStorage';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithDocument: (documentType: string, documentNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  loginWithDocument: async () => {},
  logout: async () => {},
  clearError: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const segments = useSegments();

  // Función para limpiar el almacenamiento
  const clearStorage = async () => {
    try {
      await deleteItem(KEYS.AUTH_TOKEN);
      await deleteItem(KEYS.AUTH_USER);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Limpiar errores manualmente
  const clearError = () => {
    setError(null);
  };

  // Verificar autenticación y redireccionar
  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0]?.startsWith('(auth)') ?? false;

      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login' as any);
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)/orders' as any);
      }
    }
  }, [user, isLoading, segments]);

  // Cargar usuario guardado al iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        // En desarrollo, limpiar storage si es necesario
        if (__DEV__) {
          const hasSession = await hasActiveSession();
          if (!hasSession) {
            await clearStorage();
            setIsLoading(false);
            return;
          }
        }

        const savedUser = await getCurrentUser();

        if (savedUser) {
          // Verificar que el usuario tenga la estructura correcta
          if (savedUser.id && savedUser.documentType && savedUser.documentNumber) {
            setUser(savedUser);
            console.log('User loaded from storage:', savedUser.documentType, savedUser.documentNumber);
          } else {
            console.log('Invalid user data, clearing storage');
            await clearStorage();
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        await clearStorage();
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const loginWithDocument = async (documentType: string, documentNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginWithDocumentApi(documentType, documentNumber);
      setUser(response.user);
      await storeUser(response.user);

      // Marcar que la app está inicializada
      if (__DEV__) {
        await saveItem('app_storage_initialized', 'true');
      }

      console.log('Login successful, redirecting to orders');
      router.replace('/(tabs)/orders' as any);
    } catch (err: any) {
      let errorMessage = 'Error durante el inicio de sesión';

      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 404) {
        errorMessage = `El documento ${documentType} ${documentNumber} no se encuentra registrado.`;
      } else if (err.response?.status === 401) {
        errorMessage = 'Su cuenta está inactiva. Por favor contacte a soporte.';
      }

      console.error('Login failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Limpiar storage local primero
      await clearStorage();

      // Intentar logout en servidor (no bloquear si falla)
      try {
        await logoutApi();
      } catch (serverError) {
        console.warn('Server logout failed, but continuing with local logout:', serverError);
      }

      console.log('Logout successful, redirecting to login');

      // Redireccionar según plataforma
      if (Platform.OS === 'web') {
        window.location.href = '/';
      } else {
        router.replace('/(auth)/login' as any);
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      // Aún así intentar redireccionar
      if (Platform.OS === 'web') {
        window.location.href = '/';
      } else {
        router.replace('/(auth)/login' as any);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginWithDocument,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
