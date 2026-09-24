'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: ThemePreference) => void;
    theme: ThemePreference;
}

const THEME_STORAGE_KEY = 'theme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isThemePreference = (value: string | null): value is ThemePreference => (
    value === 'light' || value === 'dark' || value === 'system'
);

const getSystemTheme = (): ResolvedTheme => (
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

const getInitialTheme = (): ThemePreference => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(storedTheme)) {
        return storedTheme;
    }

    const dataTheme = document.documentElement.dataset.theme ?? null;
    return isThemePreference(dataTheme) ? dataTheme : 'light';
};

const getInitialResolvedTheme = (): ResolvedTheme => {
    if (typeof document === 'undefined') {
        return 'light';
    }

    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const applyTheme = (theme: ThemePreference): ResolvedTheme => {
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    const root = document.documentElement;

    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.dataset.theme = theme;
    root.style.colorScheme = resolvedTheme;

    return resolvedTheme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getInitialResolvedTheme);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            setResolvedTheme(applyTheme(theme));
        };

        updateTheme();
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ resolvedTheme, setTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
