import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import config from '../../config';

// Para web, usaremos localStorage como alternativa
const webStorage = {
    getItemAsync: async (key: string): Promise<string | null> => {
        return localStorage.getItem(key);
    },
    setItemAsync: async (key: string, value: string): Promise<void> => {
        localStorage.setItem(key, value);
        return;
    },
    deleteItemAsync: async (key: string): Promise<void> => {
        localStorage.removeItem(key);
        return;
    },
};

// Elegir la implementación adecuada según la plataforma
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

// Claves
export const KEYS = {
    AUTH_TOKEN: config.auth.storageKeys.token,
    AUTH_USER: config.auth.storageKeys.user,
};

// Guardar elemento en almacenamiento seguro
export async function saveItem(key: string, value: string): Promise<void> {
    try {
        await storage.setItemAsync(key, value);
    } catch (error) {
        console.error(`Error guardando ${key} en almacenamiento seguro:`, error);
        throw error;
    }
}

// Obtener elemento del almacenamiento seguro
export async function getItem(key: string): Promise<string | null> {
    try {
        return await storage.getItemAsync(key);
    } catch (error) {
        console.error(`Error obteniendo ${key} del almacenamiento seguro:`, error);
        return null;
    }
}

// Eliminar elemento del almacenamiento seguro
export async function deleteItem(key: string): Promise<void> {
    try {
        await storage.deleteItemAsync(key);
    } catch (error) {
        console.error(`Error eliminando ${key} del almacenamiento seguro:`, error);
        throw error;
    }
}

// Guardar objeto en almacenamiento seguro
export async function saveObject<T>(key: string, value: T): Promise<void> {
    try {
        const jsonValue = JSON.stringify(value);
        await saveItem(key, jsonValue);
    } catch (error) {
        console.error(`Error guardando objeto ${key} en almacenamiento seguro:`, error);
        throw error;
    }
}

// Obtener objeto del almacenamiento seguro
export async function getObject<T>(key: string): Promise<T | null> {
    try {
        const jsonValue = await getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Error obteniendo objeto ${key} del almacenamiento seguro:`, error);
        return null;
    }
}