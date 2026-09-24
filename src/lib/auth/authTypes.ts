// User type definition
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    role?: string;
    avatarUrl?: string;
}

// Auth state type
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
}

export type AuthFlowMode = 'login' | 'signup';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface VerifyOtpData {
    email: string;
    token: string;
}

export interface ResendOtpData {
    email: string;
    mode: AuthFlowMode;
    name?: string;
}
