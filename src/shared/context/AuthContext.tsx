import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import {
    saveToken,
    getToken,
    saveUserData,
    getUserData,
    clearStorage
} from '../utils/secureStorage';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null;
    login: (token: string, userData: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any | null>(null);

    // Check for existing auth on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<boolean> => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const userData = await getUserData();

            if (token && userData) {
                setIsAuthenticated(true);
                setUser(userData);
                return true;
            } else {
                setIsAuthenticated(false);
                setUser(null);
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token: string, userData: any): Promise<void> => {
        try {
            await saveToken(token);
            await saveUserData(userData);
            setUser(userData);
            setIsAuthenticated(true);
            router.replace('/(tabs)'); // Navigate to main app
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await clearStorage();
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/login'); // Navigate to login
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};