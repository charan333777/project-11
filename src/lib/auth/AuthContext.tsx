'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    LoginCredentials,
    ResendOtpData,
    SignupData,
    User,
    VerifyOtpData,
} from './authTypes';
import {
    completeDemoSignup,
    ensureDemoAccountExists,
    getDemoSessionUser,
    loginDemoAccount,
    logoutDemoAccount,
    stageDemoSignup,
    updateDemoPassword,
    verifyDemoRecovery,
} from '@/lib/demoStore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    verifyEmailOtp: (data: VerifyOtpData & { type?: 'signup' | 'recovery' | 'email' }) => Promise<void>;
    resendEmailOtp: (data: ResendOtpData) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    requestOtpForCurrentUser: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        setUser(getDemoSessionUser());
    };

    useEffect(() => {
        setUser(getDemoSessionUser());
        setLoading(false);
    }, []);

    const login = async ({ email, password }: LoginCredentials) => {
        setUser(loginDemoAccount(email, password));
    };

    const signup = async ({ name, email, password }: SignupData) => {
        stageDemoSignup({ name: name.trim(), email: email.trim(), password });
    };

    const verifyEmailOtp = async ({ email, token, type = 'signup' }: VerifyOtpData & { type?: 'signup' | 'recovery' | 'email' }) => {
        const verifiedUser = type === 'signup'
            ? completeDemoSignup(email, token)
            : verifyDemoRecovery(email, token);
        setUser(verifiedUser);
    };

    const resendEmailOtp = async ({ email }: ResendOtpData) => {
        if (!email.trim()) throw new Error('Email is required.');
    };

    const requestPasswordReset = async (email: string) => {
        ensureDemoAccountExists(email);
    };

    const updatePassword = async (password: string) => {
        updateDemoPassword(password);
    };

    const requestOtpForCurrentUser = async () => {
        if (!getDemoSessionUser()) throw new Error('User not authenticated.');
    };

    const logout = async () => {
        setLoading(true);
        logoutDemoAccount();
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            signup,
            verifyEmailOtp,
            resendEmailOtp,
            requestPasswordReset,
            updatePassword,
            requestOtpForCurrentUser,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
