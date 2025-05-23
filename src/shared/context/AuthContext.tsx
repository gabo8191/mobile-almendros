import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { router, useSegments } from 'expo-router';
import { Platform } from 'react-native';
import { User } from '../../features/auth/types/auth.types';
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
  storeUser,
  loginWithDocument as loginWithDocumentApi,
} from '../../features/auth/api/authService';
import { deleteItem, KEYS, saveItem } from '../../shared/utils/secureStorage';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithDocument: (documentType: string, documentNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  clearStorage: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  loginWithDocument: async () => {},
  logout: async () => {},
  clearStorage: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const segments = useSegments();

  // Clear storage function
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

  // Check if user is authenticated and redirect accordingly
  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0]?.startsWith('(auth)') ?? false;

      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login' as any);
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)' as any);
      }
    }
  }, [user, isLoading, segments]);

  // Load saved user on app start
  useEffect(() => {
    async function loadUser() {
      try {
        // En desarrollo, limpiar storage si hay datos de sesión anterior
        if (__DEV__) {
          const isInitialized = (await getCurrentUser()) !== null;
          if (isInitialized) {
            await clearStorage();
            setIsLoading(false);
            return;
          }
        }

        const savedUser = await getCurrentUser();

        if (savedUser) {
          // Verificar que el usuario tenga la estructura correcta
          if (savedUser.id && (savedUser.role || savedUser.documentType)) {
            setUser(savedUser);
          } else {
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(email, password);
      setUser(response.user);
      await storeUser(response.user);

      if (__DEV__) {
        await saveItem('app_storage_initialized', 'true');
      }

      router.replace('/(tabs)' as any);
    } catch (err: any) {
      setError('Credenciales inválidas. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDocument = async (documentType: string, documentNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginWithDocumentApi(documentType, documentNumber);
      setUser(response.user);
      await storeUser(response.user);

      if (__DEV__) {
        await saveItem('app_storage_initialized', 'true');
      }

      router.replace('/(tabs)' as any);
    } catch (err: any) {
      let errorMessage = 'Error durante el inicio de sesión';

      if (err.response?.status === 404) {
        errorMessage = `El documento ${documentType} ${documentNumber} no se encuentra registrado.`;
      } else if (err.response?.status === 401) {
        errorMessage = 'Su cuenta está inactiva. Por favor contacte a soporte.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Primero limpiar el storage local
      await clearStorage();

      // Intentar hacer logout en el servidor (pero no bloquear si falla)
      try {
        await logoutApi();
      } catch (serverError) {
        console.warn('Server logout failed, but continuing with local logout:', serverError);
        // Ignorar errores del servidor, lo importante es limpiar el storage local
      }

      // Usar diferentes métodos según la plataforma
      if (Platform.OS === 'web') {
        // En web, forzar recarga completa
        window.location.href = '/login';
      } else {
        // En móvil, usar router
        router.replace('/(auth)/login' as any);
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      // Aún así, intentar redirigir al login
      if (Platform.OS === 'web') {
        window.location.href = '/login';
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
        login,
        loginWithDocument,
        logout,
        clearStorage,
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
