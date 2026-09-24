'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ChangeEmailModal } from '@/features/profile/components/ChangeEmailModal';
import { EmailSecurityInfo } from '@/features/profile/components/EmailSecurityInfo';
import { EditProfileModal } from '@/features/profile/components/EditProfileModal';
import { ChangePasswordModal } from '@/features/profile/components/ChangePasswordModal';
import { DangerZone } from '@/features/profile/components/DangerZone';
import { FeedbackToast, type FeedbackState } from '@/components/ui/FeedbackToast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        if (!feedback) return;

        const timeout = window.setTimeout(() => {
            setFeedback(null);
        }, 4000);

        return () => window.clearTimeout(timeout);
    }, [feedback]);

    const showFeedback = (type: FeedbackState['type'], message: string) => {
        setFeedback({ type, message });
    };

    return (
        <ProtectedRoute>
            <div className="app-shell">
                {feedback && (
                    <FeedbackToast
                        feedback={feedback}
                        onDismiss={() => setFeedback(null)}
                    />
                )}

                {/* Page Header */}
                <div className="app-shell-header">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Profile Settings</h1>
                            <p className="mt-1 text-neutral-600 dark:text-gray-300">Manage your account information and preferences</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-3xl mx-auto px-6 py-12">
                    <div className="space-y-8">
                        {!user ? (
                            <div className="rounded-2xl border border-neutral-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)]">
                                <p className="text-neutral-600 dark:text-gray-300">Syncing your profile information...</p>
                            </div>
                        ) : (
                            <>
                                <section>
                                    <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Profile Info</h2>
                                    <ProfileCard user={{
                                        ...user,
                                        role: user.role || 'Job Seeker'
                                    }} onEdit={() => setIsEditModalOpen(true)} />
                                </section>

                                <section>
                                    <EmailSecurityInfo
                                        email={user.email}
                                        onChangePassword={() => setIsChangePasswordModalOpen(true)}
                                    />
                                </section>

                                <section>
                                    <DangerZone onErrorMessage={(message) => showFeedback('error', message)} />
                                </section>

                                <EditProfileModal
                                    isOpen={isEditModalOpen}
                                    onClose={() => setIsEditModalOpen(false)}
                                    onChangeEmailRequest={() => setIsChangeEmailModalOpen(true)}
                                    onErrorMessage={(message) => showFeedback('error', message)}
                                    onSuccessMessage={(message) => showFeedback('success', message)}
                                    user={user}
                                />

                                <ChangeEmailModal
                                    isOpen={isChangeEmailModalOpen}
                                    onClose={() => setIsChangeEmailModalOpen(false)}
                                    onErrorMessage={(message) => showFeedback('error', message)}
                                    onSuccessMessage={(message) => showFeedback('success', message)}
                                    currentEmail={user.email}
                                />

                                <ChangePasswordModal
                                    isOpen={isChangePasswordModalOpen}
                                    onClose={() => setIsChangePasswordModalOpen(false)}
                                    onErrorMessage={(message) => showFeedback('error', message)}
                                    onSuccessMessage={(message) => showFeedback('success', message)}
                                />
                            </>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
