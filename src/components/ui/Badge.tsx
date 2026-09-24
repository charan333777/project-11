import React from 'react';
import { JobStatus, getJobStatusLabel } from '@/features/jobs/types';

interface BadgeProps {
    status: JobStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
    const statusConfig = {
        applied: {
            className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-900',
        },
        interview: {
            className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-900',
        },
        offer: {
            className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/60 dark:text-green-200 dark:border-green-900',
        },
        rejected: {
            className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
        className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
            {getJobStatusLabel(status)}
        </span>
    );
};
