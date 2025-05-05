export type User = {
    id: string;
    cedula: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
};

export type LoginCredentials = {
    cedula: string;
    password: string;
};

export type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};