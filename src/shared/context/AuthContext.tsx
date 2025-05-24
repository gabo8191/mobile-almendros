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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
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

  // Cargar usuario guardado al iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        console.log('🔄 Loading user from storage...');

        const hasSession = await hasActiveSession();
        if (!hasSession) {
          console.log('❌ No active session found');
          await clearStorage();
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        const savedUser = await getCurrentUser();
        console.log('👤 Retrieved user from storage:', savedUser?.documentNumber);

        if (savedUser) {
          if (savedUser.id && savedUser.documentType && savedUser.documentNumber) {
            setUser(savedUser);
            console.log('✅ User loaded successfully:', savedUser.documentType, savedUser.documentNumber);
          } else {
            console.log('❌ Invalid user data, clearing storage');
            await clearStorage();
          }
        }
      } catch (err) {
        console.error('❌ Error loading user:', err);
        await clearStorage();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }

    loadUser();
  }, []);

  // Verificar autenticación y redireccionar
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ Waiting for initialization...');
      return;
    }

    const inAuthGroup = segments[0]?.startsWith('(auth)') ?? false;

    console.log('🔀 Navigation check:', {
      hasUser: !!user,
      inAuthGroup,
      currentSegment: segments[0],
      isLoading,
    });

    if (!user && !inAuthGroup) {
      console.log('🔄 Redirecting to login - no user');
      router.replace('/(auth)/login' as any);
    } else if (user && inAuthGroup) {
      console.log('🔄 Redirecting to orders - user authenticated');
      router.replace('/(tabs)/orders' as any);
    }
  }, [user, isInitialized, segments]);

  const loginWithDocument = async (documentType: string, documentNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login with:', documentType, documentNumber);
      const response = await loginWithDocumentApi(documentType, documentNumber);

      const transformedUser: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        phoneNumber: '',
        address: '',
        documentType: response.user.documentType,
        documentNumber: response.user.documentNumber,
        isActive: response.user.isActive,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };

      setUser(transformedUser);
      await storeUser(transformedUser);

      // Marcar que la app está inicializada
      if (__DEV__) {
        await saveItem('app_storage_initialized', 'true');
      }

      console.log('✅ Login successful, redirecting to orders');
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

      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      console.log('🚪 Logging out...');

      // Limpiar storage local primero
      await clearStorage();

      // Intentar logout en servidor (no bloquear si falla)
      try {
        await logoutApi();
      } catch (serverError) {
        console.warn('⚠️ Server logout failed, but continuing with local logout:', serverError);
      }

      console.log('✅ Logout successful, redirecting to login');

      router.replace('/(auth)/login' as any);
    } catch (err: any) {
      console.error('❌ Logout error:', err);
      router.replace('/(auth)/login' as any);
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
