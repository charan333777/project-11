'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { profileApi } from '@/features/profile/lib/profileApi';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/utils';
import { DEMO_OTP } from '@/lib/demoStore';

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessMessage: (message: string) => void;
    onErrorMessage: (message: string) => void;
    currentEmail: string;
}

interface ChangeEmailErrors {
    oldEmail?: string;
    newEmail?: string;
    otp?: string;
    form?: string;
}

const OTP_LENGTH = 8;
const RESEND_COOLDOWN_MS = 30_000;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialErrors: ChangeEmailErrors = {};

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
    isOpen,
    onClose,
    onSuccessMessage,
    onErrorMessage,
    currentEmail,
}) => {
    const { refreshUser } = useAuth();
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState('');
    const [requestedAt, setRequestedAt] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [errors, setErrors] = useState<ChangeEmailErrors>(initialErrors);

    const normalizedCurrentEmail = useMemo(() => currentEmail.trim().toLowerCase(), [currentEmail]);
    const isVerifyStep = !!pendingEmail;

    useEffect(() => {
        if (!isOpen) return;

        setOldEmail('');
        setNewEmail('');
        setPendingEmail(null);
        setOtpCode('');
        setRequestedAt(null);
        setCooldownRemaining(0);
        setErrors(initialErrors);
    }, [isOpen, currentEmail]);

    useEffect(() => {
        if (!requestedAt || !isVerifyStep) {
            setCooldownRemaining(0);
            return;
        }

        const updateCooldown = () => {
            const millisecondsRemaining = requestedAt + RESEND_COOLDOWN_MS - Date.now();
            setCooldownRemaining(Math.max(0, Math.ceil(millisecondsRemaining / 1000)));
        };

        updateCooldown();

        const interval = window.setInterval(updateCooldown, 1000);

        return () => window.clearInterval(interval);
    }, [isVerifyStep, requestedAt]);

    const handleClose = () => {
        if (loading || resendLoading) return;
        setErrors(initialErrors);
        onClose();
    };

    const resetToRequestStep = () => {
        if (loading || resendLoading) return;

        setPendingEmail(null);
        setOtpCode('');
        setRequestedAt(null);
        setCooldownRemaining(0);
        setErrors(initialErrors);
    };

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedOldEmail = oldEmail.trim();
        const trimmedNewEmail = newEmail.trim();
        const nextErrors: ChangeEmailErrors = {};

        if (!trimmedOldEmail) {
            nextErrors.oldEmail = 'Current email is required';
        } else if (!emailPattern.test(trimmedOldEmail)) {
            nextErrors.oldEmail = 'Enter a valid email address';
        } else if (trimmedOldEmail.toLowerCase() !== normalizedCurrentEmail) {
            nextErrors.oldEmail = 'Current email does not match your account';
        }

        if (!trimmedNewEmail) {
            nextErrors.newEmail = 'New email is required';
        } else if (!emailPattern.test(trimmedNewEmail)) {
            nextErrors.newEmail = 'Enter a valid email address';
        } else if (trimmedNewEmail.toLowerCase() === normalizedCurrentEmail) {
            nextErrors.newEmail = 'Enter a different email address';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.requestEmailChange({
                currentEmail,
                oldEmail: trimmedOldEmail,
                newEmail: trimmedNewEmail,
            });

            setPendingEmail(trimmedNewEmail);
            setRequestedAt(Date.now());
            setOtpCode('');
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to send email verification code');

            console.error('Error requesting email change:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pendingEmail) return;

        const sanitizedCode = otpCode.replace(/\D/g, '');

        if (sanitizedCode.length !== OTP_LENGTH) {
            setErrors({ otp: 'Enter the full 8-digit code' });
            return;
        }

        setLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.verifyEmailChange({
                email: pendingEmail,
                token: sanitizedCode,
            });

            await refreshUser();

            onSuccessMessage('Email updated successfully');
            onClose();
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to verify your email change code');

            console.error('Error verifying email change:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!pendingEmail || cooldownRemaining > 0) return;

        setResendLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.resendEmailChangeOtp({
                email: pendingEmail,
            });

            setRequestedAt(Date.now());
            setOtpCode('');
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to resend your email change code');

            console.error('Error resending email change code:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Change Email"
            contentClassName="max-w-lg"
        >
            {isVerifyStep ? (
                <form onSubmit={handleVerifyCode} className="space-y-5">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                            Confirm your new email
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-gray-300">
                            For{' '}
                            <span className="font-medium text-neutral-900 dark:text-white">
                                {pendingEmail}
                            </span>
                            , enter demo code <strong>{DEMO_OTP}</strong> to finish changing your email.
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-gray-400">
                            No real email is sent in this frontend-only demo.
                        </p>
                    </div>

                    <OtpInput
                        value={otpCode}
                        onChange={(value) => {
                            setOtpCode(value);
                            setErrors((currentErrors) => ({ ...currentErrors, otp: undefined }));
                        }}
                        length={OTP_LENGTH}
                        disabled={loading || resendLoading}
                        error={errors.otp}
                    />

                    {errors.form && (
                        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700">
                            {errors.form}
                        </div>
                    )}

                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p>The demo verification code is {DEMO_OTP}.</p>
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

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={resetToRequestStep}
                            disabled={loading || resendLoading}
                        >
                            Use a Different Email
                        </Button>
                        <Button type="submit" disabled={loading || resendLoading}>
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Verifying...
                                </>
                            ) : 'Verify Email'}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRequestCode} className="space-y-4">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
                        Current email on file:{' '}
                        <span className="font-medium text-neutral-900 dark:text-white">
                            {currentEmail}
                        </span>
                    </div>

                    <Input
                        label="Current Email"
                        type="email"
                        value={oldEmail}
                        onChange={(e) => setOldEmail(e.target.value)}
                        placeholder="Enter your current email"
                        autoComplete="email"
                        error={errors.oldEmail}
                        required
                    />

                    <Input
                        label="New Email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter your new email"
                        autoComplete="email"
                        error={errors.newEmail}
                        required
                    />

                    <p className="text-sm text-neutral-600 dark:text-gray-300">
                        No email is sent. Use demo confirmation code {DEMO_OTP}.
                    </p>

                    {errors.form && (
                        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700">
                            {errors.form}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Sending Code...
                                </>
                            ) : 'Send Verification Code'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
