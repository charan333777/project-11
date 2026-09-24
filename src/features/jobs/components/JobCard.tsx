'use client';

import React from 'react';
import { ApplicationDensity, JobApplication } from '../types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
    job: JobApplication;
    density: ApplicationDensity;
    onToggleStar: (id: string) => void;
    onOpenDetails: (job: JobApplication) => void;
    isStarred: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
    job,
    density,
    onToggleStar,
    onOpenDetails,
    isStarred,
}) => {
    const isCompact = density !== 'comfortable';
    const isDense = density === 'dense';
    const hasDescription = !!job.job_description?.trim();
    const hasNotes = !!job.notes?.trim();

    const appliedDate = new Date(job.applied_at);
    const daysSinceApplied = Number.isNaN(appliedDate.getTime())
        ? null
        : Math.max(0, Math.floor((Date.now() - appliedDate.getTime()) / 86_400_000));

    const appliedAgeLabel = daysSinceApplied === null
        ? null
        : daysSinceApplied === 0
            ? 'today'
            : `${daysSinceApplied}d ago`;

    return (
        <Card
            glass
            className={`group flex h-full cursor-pointer flex-col transition-smooth hover:-translate-y-0.5 hover:shadow-xl ${
                isDense ? 'p-4' : isCompact ? 'p-5' : ''
            }`}
            onClick={() => onOpenDetails(job)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenDetails(job);
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
                <div className="min-w-0 flex-1">
                    <h3 className={`${isDense ? 'text-base' : 'text-xl'} line-clamp-2 font-semibold text-neutral-900 dark:text-white ${isCompact ? 'mb-0.5' : 'mb-1'}`}>
                        {job.role}
                    </h3>
                    <p className={`${isDense ? 'text-sm' : 'text-lg'} truncate text-neutral-600 dark:text-gray-300`}>
                        {job.company}
                    </p>
                </div>
                <div className={`ml-3 flex shrink-0 ${isDense ? 'flex-col items-end gap-2' : 'items-center gap-2'}`}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(job.id);
                        }}
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-smooth ${
                            isStarred
                                ? 'border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100'
                                : 'border-neutral-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 text-neutral-400 dark:text-gray-500 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-700'
                        }`}
                        aria-label={isStarred ? 'Remove star from application' : 'Star application'}
                        title={isStarred ? 'Starred application' : 'Mark as important'}
                    >
                        <svg className="w-5 h-5" fill={isStarred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.889a1 1 0 00-.364 1.118l1.519 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.127 10.1c-.783-.57-.38-1.81.588-1.81H7.63a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                    </button>
                    <Badge status={job.status} />
                </div>
            </div>

            <div className={`${isCompact ? 'mb-3' : 'mb-4'} space-y-2 text-sm text-neutral-500 dark:text-gray-400`}>
                <div className="flex items-center text-sm text-neutral-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">
                        Applied {formatDate(job.applied_at)}
                        {appliedAgeLabel && (
                            <span className="text-neutral-400 dark:text-gray-500"> - {appliedAgeLabel}</span>
                        )}
                    </span>
                </div>
            </div>

            {!isDense && (
                <div className={`flex flex-wrap gap-2 ${isCompact ? 'mb-3' : 'mb-4'}`}>
                    {hasDescription && (
                        <span className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                            JD saved
                        </span>
                    )}
                    {hasNotes && (
                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            Notes
                        </span>
                    )}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-gray-800 transition-smooth">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                    View details
                </span>
                <svg className="h-4 w-4 text-neutral-400 transition-smooth group-hover:translate-x-0.5 group-hover:text-primary-500 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Card>
    );
};
