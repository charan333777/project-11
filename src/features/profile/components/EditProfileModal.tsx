'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { User } from '@/lib/auth/authTypes';
import { profileApi } from '@/features/profile/lib/profileApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/utils';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChangeEmailRequest: () => void;
    onSuccessMessage: (message: string) => void;
    onErrorMessage: (message: string) => void;
    user: User;
}

interface EditProfileErrors {
    name?: string;
    form?: string;
}

const initialErrors: EditProfileErrors = {};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    onChangeEmailRequest,
    onSuccessMessage,
    onErrorMessage,
    user,
}) => {
    const { refreshUser } = useAuth();
    const [name, setName] = useState(user.name);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<EditProfileErrors>(initialErrors);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setErrors(initialErrors);
        }
    }, [isOpen, user.name]);

    const handleClose = () => {
        if (loading) return;
        setErrors(initialErrors);
        onClose();
    };

    const handleChangeEmail = () => {
        if (loading) return;
        setErrors(initialErrors);
        onClose();
        onChangeEmailRequest();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const nextErrors: EditProfileErrors = {};

        if (!trimmedName) {
            nextErrors.name = 'Name is required';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setErrors(initialErrors);

        try {
            await profileApi.updateProfile({
                name: trimmedName,
            });

            await refreshUser();

            onSuccessMessage('Profile updated successfully');
            onClose();
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to update profile');

            console.error('Error updating profile:', error);
            setErrors({ form: message });
            onErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Edit Profile"
            contentClassName="max-w-lg"
            footer={
                <>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-profile-form" disabled={loading}>
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Saving...
                            </>
                        ) : 'Save'}
                    </Button>
                </>
            }
        >
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    error={errors.name}
                    disabled={loading}
                    required
                />

                <div className="rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50/80 dark:bg-gray-900/70 px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Email</p>
                            <p className="mt-1 text-sm text-neutral-600 dark:text-gray-300">
                                {user.email}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleChangeEmail}
                            disabled={loading}
                        >
                            Change Email
                        </Button>
                    </div>
                </div>

                {errors.form && (
                    <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700">
                        {errors.form}
                    </div>
                )}
            </form>
        </Modal>
    );
};
