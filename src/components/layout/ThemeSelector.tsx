'use client';

import React from 'react';
import { ThemePreference, useTheme } from '@/lib/theme/ThemeContext';

const themeOptions: { label: string; value: ThemePreference }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
];

export const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <label className="relative flex items-center">
            <span className="sr-only">Select theme</span>
            <div className="pointer-events-none absolute left-3 text-neutral-500 dark:text-gray-400">
                {theme === 'dark' ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12.79A9 9 0 1111.21 3c0 .28.02.56.05.83A7 7 0 0021 12.79z" />
                    </svg>
                ) : theme === 'light' ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.114 6.364l-1.59-1.59M7.476 7.476l-1.59-1.59m12.228 0l-1.59 1.59M7.476 16.524l-1.59 1.59M12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L8.25 19H4.5l1.5-2m3.75 0h5.25m-5.25 0v-7.5m5.25 7.5L15.75 19h3.75l-1.5-2m-3.75 0v-7.5m-4.5-3.75h9a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                )}
            </div>

            <select
                aria-label="Theme"
                className="h-10 rounded-lg border border-neutral-200 bg-white/80 pl-9 pr-8 text-sm font-medium text-neutral-700 shadow-sm transition-smooth hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-300 dark:shadow-[0_0_20px_rgba(0,0,0,0.25)] dark:hover:bg-gray-800"
                onChange={(e) => setTheme(e.target.value as ThemePreference)}
                value={theme}
            >
                {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};
