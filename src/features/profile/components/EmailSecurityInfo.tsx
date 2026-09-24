'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface EmailSecurityInfoProps {
    email: string;
    onChangePassword: () => void;
}

export const EmailSecurityInfo: React.FC<EmailSecurityInfoProps> = ({ email, onChangePassword }) => {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 p-6 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)] transition-smooth hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Security</h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-gray-300">
                        Your account is secured with a password.
                    </p>
                </div>

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M12 3l7 4v5c0 4.04-2.87 7.66-7 8.5C7.87 19.66 5 16.04 5 12V7l7-4z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9.5 12.5l1.7 1.7 3.3-4.2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-gray-400">
                        Sign-in email
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
                        {email}
                    </p>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-gray-400">
                        Password
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-neutral-700 dark:text-gray-300">
                            ••••••••
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onChangePassword}
                        >
                            Change
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
