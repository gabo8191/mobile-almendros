import { createContext, useState, useEffect, ReactNode } from 'react';
import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
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
    const segments = useSegments();

    // Check if the user is authenticated
    // If not, redirect to the login page
    useEffect(() => {
        if (!user && !loading) {
            const inAuthGroup = segments[0] === '(auth)';

            if (!inAuthGroup) {
                router.replace('/(auth)/login');
            }
        } else if (user) {
            const inAuthGroup = segments[0] === '(auth)';

            if (inAuthGroup) {
                router.replace('/(tabs)');
            }
        }
    }, [user, loading, segments]);

    // Load the auth state from storage
    useEffect(() => {
        async function loadAuthState() {
            try {
                const authStateJson = await SecureStore.getItemAsync(AUTH_KEY);

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
            await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authState));
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
            saveAuthState(user, token);

            router.replace('/(tabs)');
        } catch (err) {
            console.error('Login failed', err);
            setError('Credenciales inválidas. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        saveAuthState(null, null);
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}