import { createContext, useState, useEffect, ReactNode } from 'react';
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { login as loginApi } from '../api/authService';
import { User } from '../types/auth.types';

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (cedula: string, password: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: false,
    error: null,
    login: async () => { },
    logout: () => { },
});

type AuthProviderProps = {
    children: ReactNode;
};

// Key for storing auth state in SecureStore
const AUTH_KEY = 'auth_state';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isNavigationReady, setIsNavigationReady] = useState(Platform.OS !== 'web');
    const segments = useSegments();

    // Use simple navigation check for web
    useEffect(() => {
        if (Platform.OS === 'web') {
            // For web, we'll consider navigation ready after a short delay
            const timer = setTimeout(() => {
                setIsNavigationReady(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Check if the user is authenticated and redirect accordingly
    useEffect(() => {
        if (!isNavigationReady || loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // If not authenticated and not on auth screen, redirect to login
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // If authenticated and on auth screen, redirect to tabs
            router.replace('/(tabs)');
        }
    }, [user, segments, loading, isNavigationReady]);

    // Load the auth state from storage when the app loads
    useEffect(() => {
        async function loadAuthState() {
            try {
                let authStateJson = null;
                // Use different storage strategy for web and native
                if (Platform.OS === 'web') {
                    authStateJson = localStorage.getItem(AUTH_KEY);
                } else {
                    authStateJson = await SecureStore.getItemAsync(AUTH_KEY);
                }

                if (authStateJson) {
                    const authState = JSON.parse(authStateJson);
                    setUser(authState.user);
                    setToken(authState.token);
                }
            } catch (e) {
                console.error('Failed to load auth state', e);
            } finally {
                setLoading(false);
            }
        }

        loadAuthState();
    }, []);

    // Save the auth state to storage
    const saveAuthState = async (user: User | null, token: string | null) => {
        try {
            const authState = { user, token };

            // Use different storage strategy for web and native
            if (Platform.OS === 'web') {
                if (user && token) {
                    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
                } else {
                    localStorage.removeItem(AUTH_KEY);
                }
            } else {
                if (user && token) {
                    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authState));
                } else {
                    await SecureStore.deleteItemAsync(AUTH_KEY);
                }
            }
        } catch (e) {
            console.error('Failed to save auth state', e);
        }
    };

    // Login function
    const login = async (cedula: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { user, token } = await loginApi(cedula, password);

            setUser(user);
            setToken(token);
            await saveAuthState(user, token);
        } catch (err) {
            console.error('Login failed', err);
            setError('Credenciales inválidas. Por favor intente nuevamente.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setLoading(true);

        try {
            setUser(null);
            setToken(null);
            await saveAuthState(null, null);
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}