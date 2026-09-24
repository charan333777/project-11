'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth } from '@/lib/auth/AuthContext';
import { getErrorMessage } from '@/lib/utils';
import { DEMO_OTP } from '@/lib/demoStore';

type Step = 'request' | 'verify' | 'reset';

const OTP_LENGTH = 8;
const RESEND_COOLDOWN_MS = 30_000;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { requestPasswordReset, verifyEmailOtp, updatePassword, logout } = useAuth();

    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [notice, setNotice] = useState<{ type: 'info' | 'success'; message: string } | null>(null);

    const [requestedAt, setRequestedAt] = useState(0);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // Cooldown timer
    useEffect(() => {
        if (!requestedAt) {
            setCooldownRemaining(0);
            return;
        }

        const update = () => {
            const ms = requestedAt + RESEND_COOLDOWN_MS - Date.now();
            setCooldownRemaining(Math.max(0, Math.ceil(ms / 1000)));
        };

        update();
        const interval = window.setInterval(update, 1000);
        return () => window.clearInterval(interval);
    }, [requestedAt]);

    // ─── Step 1: Request recovery code ───
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setFieldErrors({ email: 'Email is required' });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            setFieldErrors({ email: 'Enter a valid email address' });
            return;
        }

        setLoading(true);
        setFormError('');
        setFieldErrors({});

        try {
            await requestPasswordReset(trimmedEmail);
            setRequestedAt(Date.now());
            setNotice({ type: 'info', message: `Use demo recovery code ${DEMO_OTP} for ${trimmedEmail}.` });
            setStep('verify');
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to send recovery code right now.'));
        } finally {
            setLoading(false);
        }
    };

    // ─── Step 2: Verify OTP ───
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const sanitizedCode = otpCode.replace(/\D/g, '');
        if (sanitizedCode.length !== OTP_LENGTH) {
            setFieldErrors({ otp: 'Enter the full 8-digit code' });
            return;
        }

        setLoading(true);
        setFormError('');
        setFieldErrors({});

        try {
            await verifyEmailOtp({ email: email.trim(), token: sanitizedCode, type: 'recovery' });
            setNotice({ type: 'success', message: 'Identity verified. Set your new password.' });
            setStep('reset');
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to verify your code right now.'));
        } finally {
            setLoading(false);
        }
    };

    // ─── Step 2b: Resend recovery code ───
    const handleResendCode = async () => {
        if (cooldownRemaining > 0) return;

        setResendLoading(true);
        setFormError('');
        setNotice(null);

        try {
            await requestPasswordReset(email.trim());
            setRequestedAt(Date.now());
            setOtpCode('');
            setFieldErrors({});
            setNotice({ type: 'info', message: `Demo recovery code refreshed: ${DEMO_OTP}.` });
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to resend code right now.'));
        } finally {
            setResendLoading(false);
        }
    };

    // ─── Step 3: Set new password ───
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors: Record<string, string> = {};

        if (!newPassword) {
            nextErrors.newPassword = 'Password is required';
        } else if (newPassword.length < 6) {
            nextErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            nextErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setLoading(true);
        setFormError('');
        setFieldErrors({});

        try {
            await updatePassword(newPassword);
            await logout();
            router.replace('/login?message=Password updated successfully. Please log in.');
        } catch (error) {
            setFormError(getErrorMessage(error, 'Unable to update your password right now.'));
            setLoading(false);
        }
    };

    const heading = {
        request: 'Reset your password',
        verify: 'Enter recovery code',
        reset: 'Set a new password',
    }[step];

    const subtext = {
        request: `Enter your demo account email. The recovery code is ${DEMO_OTP}.`,
        verify: `For ${email.trim()}, use demo code ${DEMO_OTP}.`,
        reset: 'Choose a new password for your account.',
    }[step];

    return (
        <div className="app-shell flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        {heading}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        {subtext}
                    </p>
                </div>

                <Card glass>
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

                        {/* Step 1: Request */}
                        {step === 'request' && (
                            <form onSubmit={handleRequestCode} className="space-y-4">
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFieldErrors({});
                                    }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    error={fieldErrors.email}
                                    disabled={loading}
                                    required
                                />

                                {formError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                        {formError}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Recovery Code'}
                                </Button>
                            </form>
                        )}

                        {/* Step 2: Verify */}
                        {step === 'verify' && (
                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                <OtpInput
                                    value={otpCode}
                                    onChange={(value) => {
                                        setOtpCode(value);
                                        setFieldErrors({});
                                    }}
                                    length={OTP_LENGTH}
                                    disabled={loading || resendLoading}
                                    error={fieldErrors.otp}
                                />

                                {formError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                        {formError}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={loading || resendLoading}>
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                </Button>

                                <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p>Didn&apos;t get a code? Check spam first.</p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleResendCode}
                                            disabled={resendLoading || cooldownRemaining > 0 || loading}
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
                        )}

                        {/* Step 3: Reset */}
                        {step === 'reset' && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
                                    }}
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
                                    error={fieldErrors.newPassword}
                                    disabled={loading}
                                    required
                                />

                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                                    }}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    error={fieldErrors.confirmPassword}
                                    disabled={loading}
                                    required
                                />

                                {formError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                        {formError}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
