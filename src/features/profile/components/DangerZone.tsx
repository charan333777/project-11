'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { profileApi } from '@/features/profile/lib/profileApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/utils';

interface DangerZoneProps {
    onErrorMessage: (message: string) => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onErrorMessage }) => {
    const router = useRouter();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationText, setConfirmationText] = useState('');

    const isDeleteEnabled = confirmationText === 'DELETE';

    const handleDeleteAccount = async () => {
        if (!isDeleteEnabled) return;

        setLoading(true);
        setError('');

        try {
            await profileApi.deleteAccount();
            await logout();
            router.replace('/');
        } catch (deleteError) {
            const message = getErrorMessage(deleteError, 'Unable to delete your account right now');

            console.error('Delete account error:', deleteError);
            setError(message);
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setError('');
        setConfirmationText('');
        setIsOpen(false);
    };

    return (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-gray-900 p-6 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)] transition-smooth hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-red-900 dark:text-red-200">Danger Zone</h2>
                    <p className="mt-1 max-w-2xl text-sm text-red-700 dark:text-red-300">
                        Deleting your account permanently removes your Banddle applications and access. This action cannot be undone.
                    </p>
                </div>

                <Button variant="danger" onClick={() => setIsOpen(true)}>
                    Delete Account
                </Button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Delete Account"
                contentClassName="max-w-lg"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-700 dark:text-gray-300">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    <Input
                        label='Type "DELETE" to confirm'
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="DELETE"
                        autoComplete="off"
                    />

                    {error && (
                        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700">
                            {error}
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
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDeleteAccount}
                            disabled={loading || !isDeleteEnabled}
                        >
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Deleting...
                                </>
                            ) : 'Confirm Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
