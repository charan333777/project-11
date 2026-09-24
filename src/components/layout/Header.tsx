'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeSelector } from '@/components/layout/ThemeSelector';

export const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout, loading } = useAuth();

    const isDashboardActive = pathname === '/dashboard';
    const isKanbanActive = pathname === '/dashboard/kanban';
    const isProfileActive = pathname === '/profile';

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    return (
        <header className="glass sticky top-0 z-50 border-b border-white/20 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center self-start">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Banddle</h1>
                    </Link>

                    {/* Navigation */}
                    <nav aria-label="Main navigation" className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                        <ThemeSelector />

                        {loading ? (
                            <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100 dark:bg-gray-800"></div>
                        ) : !isAuthenticated ? (
                            <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex-none">
                                <Link
                                    href="/"
                                    className={`text-sm font-medium transition-smooth ${pathname === '/'
                                        ? 'text-primary-600'
                                        : 'text-neutral-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                                        }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className={`text-sm font-medium transition-smooth ${pathname === '/about'
                                        ? 'text-primary-600'
                                        : 'text-neutral-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                                        }`}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-neutral-700 dark:text-gray-300 hover:text-primary-600 bg-transparent px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-smooth"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-smooth shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex-none">
                                    <Link
                                        href="/dashboard"
                                        className={`text-sm font-medium transition-smooth ${isDashboardActive
                                            ? 'text-primary-600'
                                            : 'text-neutral-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/kanban"
                                        className={`text-sm font-medium transition-smooth ${isKanbanActive
                                            ? 'text-primary-600'
                                            : 'text-neutral-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                                            }`}
                                    >
                                        Kanban
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className={`text-sm font-medium transition-smooth ${isProfileActive
                                            ? 'text-primary-600'
                                            : 'text-neutral-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                                            }`}
                                    >
                                        Profile
                                    </Link>
                                </div>
                                <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto md:ml-2">
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900 dark:text-white sm:border-l sm:border-neutral-200 sm:pl-4 sm:dark:border-gray-700">
                                        {user?.name}
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
