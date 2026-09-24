'use client';

import React from 'react';
import Image from 'next/image';
import { User } from '@/lib/auth/authTypes';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface ProfileCardProps {
    user: User;
    onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEdit }) => {
    const memberSince = user.createdAt ? formatDate(user.createdAt) : 'Recently joined';

    return (
        <div className="relative rounded-2xl border border-neutral-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900 p-8 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)] transition-smooth hover:-translate-y-0.5 hover:shadow-md">
            {onEdit && (
                <Button
                    onClick={onEdit}
                    variant="ghost"
                    size="sm"
                    className="absolute right-6 top-6 border border-neutral-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/90 text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                </Button>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-blue-950 dark:to-blue-900 border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center text-primary-600 dark:text-blue-200 text-3xl font-bold">
                        {user.avatarUrl ? (
                            <Image
                                src={user.avatarUrl}
                                alt={user.name}
                                width={96}
                                height={96}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-grow text-center md:text-left">
                    <div className="pr-20 md:pr-28">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
                        <p className="mt-1 text-neutral-500 dark:text-gray-300">{user.email}</p>
                        {user.role && (
                            <span className="mt-2 inline-flex items-center rounded-full bg-primary-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-blue-200">
                                {user.role}
                            </span>
                        )}
                    </div>

                    <div className="mt-8 border-t border-neutral-200 dark:border-gray-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800 p-4 transition-smooth hover:border-neutral-200 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800/95">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-gray-400 uppercase tracking-wider">Account Status</h3>
                            <p className="mt-1 text-neutral-900 dark:text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">Active Member</p>
                        </div>
                        <div className="rounded-xl border border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800 p-4 transition-smooth hover:border-neutral-200 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800/95">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-gray-400 uppercase tracking-wider">Member Since</h3>
                            <p className="mt-1 text-neutral-900 dark:text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">{memberSince}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
