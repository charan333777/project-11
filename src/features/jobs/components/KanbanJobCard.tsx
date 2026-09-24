'use client';

import React, { useMemo } from 'react';
import {
    JobApplication,
    JobStatus,
    JOB_STATUS_OPTIONS,
    getJobStatusLabel,
    isCanonicalJobStatus,
} from '../types';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';

interface KanbanJobCardProps {
    job: JobApplication;
    isUpdating?: boolean;
    onStatusChange: (job: JobApplication, nextStatus: JobStatus) => void;
    onOpenDetails: (job: JobApplication) => void;
}

export const KanbanJobCard: React.FC<KanbanJobCardProps> = ({
    job,
    isUpdating = false,
    onStatusChange,
    onOpenDetails,
}) => {
    const hasDescription = !!job.job_description?.trim();
    const hasNotes = !!job.notes?.trim();

    const statusOptions = useMemo(() => {
        if (isCanonicalJobStatus(job.status)) {
            return JOB_STATUS_OPTIONS;
        }

        return [
            { value: job.status, label: getJobStatusLabel(job.status) },
            ...JOB_STATUS_OPTIONS,
        ];
    }, [job.status]);

    return (
        <article className="rounded-xl border border-neutral-200 bg-white/90 p-3 shadow-sm transition-smooth hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-[0_0_30px_rgba(0,0,0,0.18),0_12px_30px_rgba(0,0,0,0.28)]">
            <div className="flex items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => onOpenDetails(job)}
                    className="min-w-0 flex-1 text-left"
                >
                    <h3 className="truncate text-base font-semibold text-neutral-900 dark:text-white">
                        {job.role}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-neutral-600 dark:text-gray-300">
                        {job.company || 'Company not set'}
                    </p>
                </button>

                {job.starred && (
                    <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                        title="Starred application"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.889a1 1 0 00-.364 1.118l1.519 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.127 10.1c-.783-.57-.38-1.81.588-1.81H7.63a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                        <span className="sr-only">Starred</span>
                    </span>
                )}
            </div>

            <div className="mt-3 space-y-2 text-sm">
                <div className="flex min-w-0 items-center gap-2 text-neutral-500 dark:text-gray-400">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{job.applied_at ? formatDate(job.applied_at) : 'Applied date not set'}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {hasDescription && (
                        <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700 dark:border-primary-900/70 dark:bg-primary-950/40 dark:text-primary-200">
                            JD
                        </span>
                    )}
                    {hasNotes && (
                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            Notes
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-3 border-t border-neutral-200 pt-3 dark:border-gray-800">
                <div className="flex items-center justify-between gap-2">
                    <Select
                        aria-label={`Move ${job.role} at ${job.company} to another status`}
                        value={job.status}
                        options={statusOptions}
                        onChange={(event) => onStatusChange(job, event.target.value)}
                        disabled={isUpdating}
                        className="py-1.5 text-xs"
                    />
                    <button
                        type="button"
                        onClick={() => onOpenDetails(job)}
                        className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary-600 transition-smooth hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-blue-950/30"
                    >
                        Details
                    </button>
                </div>
                {isUpdating && (
                    <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-300">
                        Saving...
                    </p>
                )}
            </div>
        </article>
    );
};
