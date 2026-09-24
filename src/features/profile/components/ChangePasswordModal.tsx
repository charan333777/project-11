'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { profileApi } from '@/features/profile/lib/profileApi';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/utils';
import { DEMO_OTP } from '@/lib/demoStore';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessMessage: (message: string) => void;
    onErrorMessage: (message: string) => void;
}

interface ChangePasswordErrors {
    newPassword?: string;
    confirmPassword?: string;
    otp?: string;
    form?: string;
}

const OTP_LENGTH = 8;
const RESEND_COOLDOWN_MS = 30_000;
const initialErrors: ChangePasswordErrors = {};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
    onSuccessMessage,
    onErrorMessage,
}) => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isVerifyStep, setIsVerifyStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [requestedAt, setRequestedAt] = useState<number | null>(null);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [errors, setErrors] = useState<ChangePasswordErrors>(initialErrors);

    // Reset on open
    useEffect(() => {
        if (!isOpen) return;

        setNewPassword('');
        setConfirmPassword('');
        setOtpCode('');
        setIsVerifyStep(false);
        setRequestedAt(null);
        setCooldownRemaining(0);
        setErrors(initialErrors);
    }, [isOpen]);

    // Cooldown timer
    useEffect(() => {
        if (!requestedAt || !isVerifyStep) {
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
    }, [isVerifyStep, requestedAt]);

    const handleClose = () => {
        if (loading || resendLoading) return;
        setErrors(initialErrors);
        onClose();
    };

    // Step 1: Validate password and send OTP
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors: ChangePasswordErrors = {};

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
            setErrors(nextErrors);
            return;
        }

        if (!user?.email) {
            setErrors({ form: 'Unable to determine your email address.' });
            return;
        }

        setLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.requestPasswordChangeOtp({ email: user.email });
            setIsVerifyStep(true);
            setRequestedAt(Date.now());
            setOtpCode('');
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to send verification code');
            console.error('Error requesting password change OTP:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and update password
    const handleVerifyAndUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.email) return;

        const sanitizedCode = otpCode.replace(/\D/g, '');
        if (sanitizedCode.length !== OTP_LENGTH) {
            setErrors({ otp: 'Enter the full 8-digit code' });
            return;
        }

        setLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.verifyPasswordChangeOtp({ email: user.email, token: sanitizedCode });
            await profileApi.updatePassword({ password: newPassword });

            onSuccessMessage('Password updated successfully');
            onClose();
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to update your password');
            console.error('Error updating password:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendCode = async () => {
        if (!user?.email || cooldownRemaining > 0) return;

        setResendLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.requestPasswordChangeOtp({ email: user.email });
            setRequestedAt(Date.now());
            setOtpCode('');
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to resend verification code');
            console.error('Error resending password change OTP:', error);
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
            title="Change Password"
            contentClassName="max-w-lg"
        >
            {isVerifyStep ? (
                <form onSubmit={handleVerifyAndUpdate} className="space-y-5">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                            Verify your identity
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-gray-300">
                            For{' '}
                            <span className="font-medium text-neutral-900 dark:text-white">
                                {user?.email}
                            </span>
                            , use demo code <strong>{DEMO_OTP}</strong> to confirm your password change.
                        </p>
                    </div>

                    <OtpInput
                        value={otpCode}
                        onChange={(value) => {
                            setOtpCode(value);
                            setErrors((prev) => ({ ...prev, otp: undefined }));
                        }}
                        length={OTP_LENGTH}
                        disabled={loading || resendLoading}
                        error={errors.otp}
                    />

                    {errors.form && (
                        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
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
                            onClick={handleClose}
                            disabled={loading || resendLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || resendLoading}>
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Updating...
                                </>
                            ) : 'Update Password'}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRequestCode} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, newPassword: undefined }));
                        }}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        error={errors.newPassword}
                        disabled={loading}
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                        disabled={loading}
                        required
                    />

                    <p className="text-sm text-neutral-600 dark:text-gray-300">
                        No email is sent. Use demo verification code {DEMO_OTP}.
                    </p>

                    {errors.form && (
                        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
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
                            ) : 'Continue'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
