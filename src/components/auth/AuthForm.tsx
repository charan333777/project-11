'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthFlowMode } from '@/lib/auth/authTypes';
import { getErrorMessage } from '@/lib/utils';
import { DEMO_OTP } from '@/lib/demoStore';

interface AuthFormProps {
    mode: AuthFlowMode;
}

interface PendingOtpState {
    email: string;
    name?: string;
    requestedAt: number;
}

type FormFields = {
    name: string;
    email: string;
    password: string;
};

type FieldErrorKeys = 'name' | 'email' | 'password' | 'otp';

const OTP_STORAGE_KEY = 'banddle-pending-signup-otp';
const OTP_LENGTH = 8;
const RESEND_COOLDOWN_MS = 30_000;
const MAX_LOGIN_FAILURES = 3;

const readPendingOtpState = (): PendingOtpState | null => {
    if (typeof window === 'undefined') return null;

    try {
        const storedValue = window.sessionStorage.getItem(OTP_STORAGE_KEY);
        if (!storedValue) return null;

        const parsed = JSON.parse(storedValue) as Partial<PendingOtpState>;
        if (typeof parsed.email !== 'string' || typeof parsed.requestedAt !== 'number') return null;

        return {
            email: parsed.email,
            name: typeof parsed.name === 'string' ? parsed.name : undefined,
            requestedAt: parsed.requestedAt,
        };
    } catch {
        return null;
    }
};

const persistPendingOtpState = (state: PendingOtpState) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(state));
};

const clearPendingOtpState = () => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(OTP_STORAGE_KEY);
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
    const router = useRouter();
    const { isAuthenticated, login, signup, verifyEmailOtp, resendEmailOtp } = useAuth();

    const [formData, setFormData] = useState<FormFields>({ name: '', email: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldErrorKeys, string>>>({});
    const [otpCode, setOtpCode] = useState('');
    const [pendingOtp, setPendingOtp] = useState<PendingOtpState | null>(null);
    const [formError, setFormError] = useState('');
    const [notice, setNotice] = useState<{ type: 'info' | 'success'; message: string } | null>(null);
    const [requestLoading, setRequestLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    // Restore pending OTP state for signup on mount
    useEffect(() => {
        if (isAuthenticated || mode !== 'signup') {
            clearPendingOtpState();
            return;
        }

        const restoredState = readPendingOtpState();
        if (!restoredState) return;

        setPendingOtp(restoredState);
        setFormData((prev) => ({
            ...prev,
            name: restoredState.name || '',
            email: restoredState.email,
        }));
        setNotice({ type: 'info', message: `Continue with demo code ${DEMO_OTP}.` });
    }, [isAuthenticated, mode]);

    // Cooldown timer for OTP resend
    useEffect(() => {
        if (!pendingOtp) {
            setCooldownRemaining(0);
            return;
        }

        const updateCooldown = () => {
            const ms = pendingOtp.requestedAt + RESEND_COOLDOWN_MS - Date.now();
            setCooldownRemaining(Math.max(0, Math.ceil(ms / 1000)));
        };

        updateCooldown();
        const interval = window.setInterval(updateCooldown, 1000);
        return () => window.clearInterval(interval);
    }, [pendingOtp]);

    const resetOtpStep = () => {
        setPendingOtp(null);
        setOtpCode('');
        setFormError('');
        setNotice(null);
        setFieldErrors({});
        clearPendingOtpState();
    };

    // ─── LOGIN HANDLER ───
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = formData.email.trim();
        const nextErrors: Partial<Record<FieldErrorKeys, string>> = {};

        if (!trimmedEmail) {
            nextErrors.email = 'Email is required';
        } else if (!isValidEmail(trimmedEmail)) {
            nextErrors.email = 'Enter a valid email address';
        }

        if (!formData.password) {
            nextErrors.password = 'Password is required';
        }

        if (Object.values(nextErrors).some(Boolean)) {
            setFieldErrors(nextErrors);
            return;
        }

        setRequestLoading(true);
        setFormError('');

        try {
            await login({ email: trimmedEmail, password: formData.password });
            router.replace('/dashboard');
        } catch (error) {
            setFailedLoginAttempts((prev) => prev + 1);
            setFormError(getErrorMessage(error, 'Unable to sign in right now.'));
        } finally {
            setRequestLoading(false);
        }
    };

    // ─── SIGNUP HANDLER (Step 1: request OTP) ───
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = formData.email.trim();
        const trimmedName = formData.name.trim();
        const nextErrors: Partial<Record<FieldErrorKeys, string>> = {};

        if (!trimmedName) {
            nextErrors.name = 'Name is required';
        }

        if (!trimmedEmail) {
            nextErrors.email = 'Email is required';
        } else if (!isValidEmail(trimmedEmail)) {
            nextErrors.email = 'Enter a valid email address';
        }

        if (!formData.password) {
            nextErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.values(nextErrors).some(Boolean)) {
            setFieldErrors(nextErrors);
            return;
        }

        setRequestLoading(true);
        setFormError('');
        setNotice(null);

        try {
            await signup({ name: trimmedName, email: trimmedEmail, password: formData.password });

            const nextPendingOtp: PendingOtpState = {
                email: trimmedEmail,
                name: trimmedName,
                requestedAt: Date.now(),
            };

            setPendingOtp(nextPendingOtp);
            setOtpCode('');
            setFieldErrors({});
            setNotice({ type: 'info', message: `Use demo verification code ${DEMO_OTP}.` });
            persistPendingOtpState(nextPendingOtp);
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to create your account right now.'));
        } finally {
            setRequestLoading(false);
        }
    };

    // ─── VERIFY OTP (Signup Step 2) ───
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingOtp) return;

        const sanitizedCode = otpCode.replace(/\D/g, '');
        if (sanitizedCode.length !== OTP_LENGTH) {
            setFieldErrors((prev) => ({ ...prev, otp: 'Enter the full 8-digit code' }));
            return;
        }

        setVerifyLoading(true);
        setFormError('');
        setNotice(null);

        try {
            await verifyEmailOtp({ email: pendingOtp.email, token: sanitizedCode, type: 'signup' });
            clearPendingOtpState();
            setNotice({ type: 'success', message: 'Email verified. Redirecting to your dashboard...' });
            router.replace('/dashboard');
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to verify your code right now.'));
        } finally {
            setVerifyLoading(false);
        }
    };

    // ─── RESEND OTP (Signup) ───
    const handleResendCode = async () => {
        if (!pendingOtp || cooldownRemaining > 0) return;

        setResendLoading(true);
        setFormError('');
        setNotice(null);

        try {
            await resendEmailOtp({ email: pendingOtp.email, mode: 'signup', name: pendingOtp.name });

            const refreshed = { ...pendingOtp, requestedAt: Date.now() };
            setPendingOtp(refreshed);
            setOtpCode('');
            setFieldErrors((prev) => ({ ...prev, otp: '' }));
            setNotice({ type: 'info', message: `Demo code refreshed: ${DEMO_OTP}.` });
            persistPendingOtpState(refreshed);
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to resend your code right now.'));
        } finally {
            setResendLoading(false);
        }
    };

    const isOtpStep = mode === 'signup' && !!pendingOtp;

    return (
        <div className="relative overflow-hidden">
            <div className="animate-slide-up transition-smooth">
                {notice && (
                    <div
                        className={`mb-4 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300'
                            : 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900/70 dark:bg-primary-950/30 dark:text-primary-300'
                        }`}
                    >
                        {notice.message}
                    </div>
                )}

                {/* ─── SIGNUP OTP STEP ─── */}
                {isOtpStep ? (
                    <form onSubmit={handleVerifyCode} className="space-y-5">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                Enter the demo verification code
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                For{' '}
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {pendingOtp.email}
                                </span>
                                , use code <strong>{DEMO_OTP}</strong>.
                            </p>
                        </div>

                        <OtpInput
                            value={otpCode}
                            onChange={(value) => {
                                setOtpCode(value);
                                setFieldErrors((prev) => ({ ...prev, otp: '' }));
                            }}
                            length={OTP_LENGTH}
                            disabled={verifyLoading || resendLoading}
                            error={fieldErrors.otp}
                        />

                        {formError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                {formError}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button type="submit" className="w-full" disabled={verifyLoading || resendLoading}>
                                {verifyLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={resetOtpStep}
                                disabled={verifyLoading || resendLoading}
                            >
                                Use a Different Email
                            </Button>
                        </div>

                        <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p>No email is sent in demo mode. The code is {DEMO_OTP}.</p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResendCode}
                                    disabled={resendLoading || cooldownRemaining > 0 || verifyLoading}
                                >
                                    {resendLoading
                                        ? 'Sending...'
                                        : cooldownRemaining > 0
                                            ? `Resend in ${cooldownRemaining}s`
                                            : 'Resend Code'}
                                </Button>
                            </div>
                        </div>
                    </form>

                /* ─── LOGIN FORM ─── */
                ) : mode === 'login' ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            error={fieldErrors.email}
                            disabled={requestLoading}
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                error={fieldErrors.password}
                                disabled={requestLoading}
                                required
                            />
                            <div className="mt-1.5 text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {formError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                {formError}
                            </div>
                        )}

                        {failedLoginAttempts >= MAX_LOGIN_FAILURES && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                Having trouble signing in?{' '}
                                <Link
                                    href="/forgot-password"
                                    className="font-semibold underline hover:no-underline"
                                >
                                    Reset your password
                                </Link>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={requestLoading}>
                            {requestLoading ? 'Signing in...' : 'Log In'}
                        </Button>
                    </form>

                /* ─── SIGNUP FORM (Step 1) ─── */
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            autoComplete="name"
                            error={fieldErrors.name}
                            disabled={requestLoading}
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            error={fieldErrors.email}
                            disabled={requestLoading}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            error={fieldErrors.password}
                            disabled={requestLoading}
                            required
                        />

                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Demo mode uses verification code {DEMO_OTP}; no email is sent.
                        </p>

                        {formError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                {formError}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={requestLoading}>
                            {requestLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};
