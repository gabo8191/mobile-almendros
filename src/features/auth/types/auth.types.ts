export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
    address?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type AuthResponse = {
    message: string;
    user: User;
    token: string;
};

export type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
};