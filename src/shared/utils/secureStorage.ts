import * as SecureStore from 'expo-secure-store';

// Keys
export const KEYS = {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
};

// Save item to secure storage
export async function saveItem(key: string, value: string): Promise<void> {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error(`Error saving ${key} to secure storage:`, error);
        throw error;
    }
}

// Get item from secure storage
export async function getItem(key: string): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error(`Error getting ${key} from secure storage:`, error);
        return null;
    }
}

// Delete item from secure storage
export async function deleteItem(key: string): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error(`Error deleting ${key} from secure storage:`, error);
        throw error;
    }
}

// Save object to secure storage
export async function saveObject<T>(key: string, value: T): Promise<void> {
    try {
        const jsonValue = JSON.stringify(value);
        await saveItem(key, jsonValue);
    } catch (error) {
        console.error(`Error saving object ${key} to secure storage:`, error);
        throw error;
    }
}

// Get object from secure storage
export async function getObject<T>(key: string): Promise<T | null> {
    try {
        const jsonValue = await getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Error getting object ${key} from secure storage:`, error);
        return null;
    }
}