import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { loginWithDocument, getClientByDocument } from '../../features/auth/api/authService';
import { saveToken, getToken, saveUserData, getUserData, clearStorage } from '../utils/secureStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const userData = await getUserData();

            if (token && userData) {
                setIsAuthenticated(true);
                setUser(userData);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (documentNumber) => {
        setIsLoading(true);
        try {
            // First get client info by document number
            const clientResponse = await getClientByDocument(documentNumber);

            if (!clientResponse || !clientResponse.client) {
                throw new Error('Cliente no encontrado');
            }

            // Then login to get token
            const loginResponse = await loginWithDocument(documentNumber);

            if (!loginResponse || !loginResponse.token) {
                throw new Error('Error al iniciar sesión');
            }

            // Save token and user data
            await saveToken(loginResponse.token);
            await saveUserData(clientResponse.client);

            // Update state
            setUser(clientResponse.client);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await clearStorage();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};