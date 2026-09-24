'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/Card';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demoStore';

function SuccessMessage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    if (!message) return null;

    return (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
            {message}
        </div>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="app-shell flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Login to continue tracking your applications
                    </p>
                </div>

                <Suspense fallback={null}>
                    <SuccessMessage />
                </Suspense>

                <Card glass>
                    <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm text-primary-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
                        <p className="font-semibold">Frontend demo account</p>
                        <p className="mt-1">Email: <code>{DEMO_EMAIL}</code></p>
                        <p>Password: <code>{DEMO_PASSWORD}</code></p>
                    </div>
                    <AuthForm mode="login" />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
