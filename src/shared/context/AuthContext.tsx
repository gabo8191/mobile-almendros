import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { User } from '../../features/auth/types/auth.types';
import { login as loginApi, logout as logoutApi, getCurrentUser, storeUser } from '../../features/auth/api/authService';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (cedula: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    error: null,
    login: async () => { },
    logout: async () => { },
});

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const segments = useSegments();

    // Check if user is authenticated and redirect accordingly
    useEffect(() => {
        if (!isLoading) {
            const inAuthGroup = segments[0]?.startsWith('(auth)') ?? false;

            if (!user && !inAuthGroup) {
                // Redirect to login if not authenticated
                router.replace('/(auth)/login' as any);
            } else if (user && inAuthGroup) {
                // Redirect to main app if already authenticated
                router.replace('/(tabs)' as any);
            }
        }
    }, [user, isLoading, segments]);

    // Load saved user on app start
    useEffect(() => {
        async function loadUser() {
            try {
                const savedUser = await getCurrentUser();
                if (savedUser) {
                    setUser(savedUser);
                }
            } catch (err) {
                console.error('Failed to load user:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    const login = async (cedula: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await loginApi(cedula, password);

            // Save user data
            setUser(response.user);
            await storeUser(response.user);

            // Redirect to orders tab
            router.replace('/(tabs)' as any);
        } catch (err: any) {
            setError('Credenciales inválidas. Por favor intente nuevamente.');
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);

        try {
            await logoutApi();
            setUser(null);
            router.replace('/(auth)/login' as any);
        } catch (err: any) {
            console.error('Logout failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook for easy context access
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};