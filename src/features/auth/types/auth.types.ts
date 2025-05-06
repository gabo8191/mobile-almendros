export type User = {
    id: string;
    cedula: string;
    name: string;
    email: string;
};

export type LoginCredentials = {
    cedula: string;
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