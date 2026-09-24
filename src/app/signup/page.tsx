'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Card } from '@/components/ui/Card';
import { DEMO_OTP } from '@/lib/demoStore';

export default function SignupPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Redirect if already authenticated
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
                        Create Your Account
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Start tracking your job applications today
                    </p>
                </div>

                <Card glass>
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm text-primary-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0m8 0v1a4 4 0 01-4 4H8m8-5h.01M21 8l-9 6-9-6m18 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0a2 2 0 00-2-2H5a2 2 0 00-2 2" />
                        </svg>
                        <p>
                            This frontend demo does not send email. Use verification code <strong>{DEMO_OTP}</strong>.
                        </p>
                    </div>

                    <AuthForm mode="signup" />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
