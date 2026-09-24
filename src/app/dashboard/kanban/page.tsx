'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { FeedbackToast, type FeedbackState } from '@/components/ui/FeedbackToast';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { ApplicationsViewToggle } from '@/features/jobs/components/ApplicationsViewToggle';
import { JobForm } from '@/features/jobs/components/JobForm';
import { KanbanJobCard } from '@/features/jobs/components/KanbanJobCard';
import { useJobs } from '@/features/jobs/hooks/useJobs';
import { formatDate } from '@/lib/utils';
import {
    JobApplication,
    JobStatus,
    JOB_SORT_OPTIONS,
    JOB_STATUS_OPTIONS,
    JOB_STATUS_VALUES,
    getJobStatusLabel,
    isCanonicalJobStatus,
} from '@/features/jobs/types';

const columnAccentClasses: Record<string, string> = {
    applied: 'bg-blue-500',
    interview: 'bg-orange-500',
    offer: 'bg-green-500',
    rejected: 'bg-neutral-500',
};

function KanbanContent() {
    const {
        jobs,
        allJobs,
        isLoading,
        loadError,
        actionError,
        clearActionError,
        filters,
        setFilters,
        refetchJobs,
        addJob,
        updateJob,
        toggleStar,
    } = useJobs();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobApplication | undefined>();
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [savingJobIds, setSavingJobIds] = useState<string[]>([]);

    useEffect(() => {
        if (!feedback) return;

        const timeout = window.setTimeout(() => {
            setFeedback(null);
        }, 4000);

        return () => window.clearTimeout(timeout);
    }, [feedback]);

    useEffect(() => {
        setFilters((current) => (
            current.status === 'all'
                ? current
                : { ...current, status: 'all' }
        ));
    }, [setFilters]);

    const showFeedback = (type: FeedbackState['type'], message: string) => {
        setFeedback({ type, message });
    };

    const columns = useMemo(() => {
        const additionalStatuses = Array.from(
            new Set(jobs.map((job) => job.status).filter((status) => !isCanonicalJobStatus(status)))
        ).sort((a, b) => a.localeCompare(b));

        return [...JOB_STATUS_VALUES, ...additionalStatuses].map((status) => ({
            status,
            title: getJobStatusLabel(status),
            jobs: jobs.filter((job) => job.status === status),
        }));
    }, [jobs]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextSearch = event.target.value;

        setFilters((current) => ({
            ...current,
            search: nextSearch,
            status: 'all',
        }));
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((current) => ({
            ...current,
            sort: event.target.value as typeof current.sort,
            status: 'all',
        }));
    };

    const handleOpenAddForm = () => {
        clearActionError();
        setSelectedJobId(null);
        setEditingJob(undefined);
        setIsFormOpen(true);
    };

    const handleEditJob = (job: JobApplication) => {
        clearActionError();
        setSelectedJobId(null);
        setEditingJob(job);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (jobData: Omit<JobApplication, 'id'>) => {
        const isEditing = !!editingJob;

        if (isEditing && editingJob) {
            await updateJob(editingJob.id, jobData);
        } else {
            await addJob(jobData);
        }

        setIsFormOpen(false);
        setEditingJob(undefined);
        showFeedback('success', isEditing ? 'Application updated' : 'Application added');
    };

    const handleStatusChange = async (job: JobApplication, nextStatus: JobStatus) => {
        if (job.status === nextStatus || !isCanonicalJobStatus(nextStatus)) return;

        clearActionError();
        setSavingJobIds((current) => (current.includes(job.id) ? current : [...current, job.id]));

        try {
            await updateJob(job.id, { status: nextStatus });
            showFeedback('success', `${job.role} moved to ${getJobStatusLabel(nextStatus)}`);
        } catch {
            // The action error banner from useJobs already handles the failure state.
        } finally {
            setSavingJobIds((current) => current.filter((id) => id !== job.id));
        }
    };

    const handleToggleStar = async (id: string) => {
        const targetJob = allJobs.find((job) => job.id === id);
        if (!targetJob) return;

        const wasStarred = !!targetJob.starred;

        try {
            await toggleStar(id);
            showFeedback('success', wasStarred ? 'Removed from starred' : 'Added to starred');
        } catch {
            // The action error banner from useJobs already handles the failure state.
        }
    };

    const handleOpenDetails = (job: JobApplication) => {
        clearActionError();
        setSelectedJobId(job.id);
    };

    const handleCloseDetails = () => {
        setSelectedJobId(null);
    };

    const getStatusOptions = (status: JobStatus) => {
        if (isCanonicalJobStatus(status)) {
            return JOB_STATUS_OPTIONS;
        }

        return [
            { value: status, label: getJobStatusLabel(status) },
            ...JOB_STATUS_OPTIONS,
        ];
    };

    const selectedJob = selectedJobId ? allJobs.find((job) => job.id === selectedJobId) ?? null : null;

    if (isLoading) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                    <p className="mt-4 font-medium text-neutral-600 dark:text-gray-300">
                        Loading your Kanban board...
                    </p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                        Unable to load the Kanban board
                    </h3>
                    <p className="mb-6 text-neutral-600 dark:text-gray-300">{loadError}</p>
                    <Button onClick={() => void refetchJobs()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            {feedback && (
                <FeedbackToast
                    feedback={feedback}
                    onDismiss={() => setFeedback(null)}
                />
            )}

            <div className="app-shell-header">
                <div className="w-full px-6 py-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Applications Kanban</h1>
                            <p className="mt-1 text-neutral-600 dark:text-gray-300">
                                Move applications through each stage without losing the details.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ApplicationsViewToggle activeView="kanban" />
                            <Button onClick={handleOpenAddForm} size="lg">
                                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Application
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flex w-full flex-1 flex-col px-6 py-6 sm:px-8 lg:px-12">
                {actionError && (
                    <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
                        <p>{actionError}</p>
                        <button
                            type="button"
                            onClick={clearActionError}
                            className="shrink-0 rounded-full p-1 text-red-500 transition-smooth hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/60"
                            aria-label="Dismiss error message"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="mb-5 rounded-xl border border-neutral-200 bg-white/85 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 dark:shadow-[0_0_24px_rgba(0,0,0,0.18),0_12px_30px_rgba(0,0,0,0.28)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                Showing {jobs.length} of {allJobs.length} applications
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[28rem] lg:max-w-[34rem] lg:flex-1">
                            <Input
                                label="Search"
                                value={filters.search}
                                onChange={handleSearchChange}
                                placeholder="Search by company or role"
                            />
                            <Select
                                label="Sort"
                                value={filters.sort}
                                onChange={handleSortChange}
                                options={JOB_SORT_OPTIONS}
                            />
                        </div>
                    </div>
                </div>

                {allJobs.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-16">
                        <div className="max-w-lg text-center">
                            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border bg-neutral-100 dark:border-gray-800 dark:bg-gray-900/90">
                                <svg className="h-8 w-8 text-neutral-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h6m0 0l-3-3m3 3l-3 3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">No applications yet</h2>
                            <p className="mt-2 text-neutral-600 dark:text-gray-300">
                                Add your first application to start moving opportunities through the Kanban board.
                            </p>
                            <div className="mt-6">
                                <Button onClick={handleOpenAddForm}>Add Your First Application</Button>
                            </div>
                        </div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-16">
                        <div className="max-w-lg text-center">
                            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border bg-neutral-100 dark:border-gray-800 dark:bg-gray-900/90">
                                <svg className="h-8 w-8 text-neutral-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">No matching applications</h2>
                            <p className="mt-2 text-neutral-600 dark:text-gray-300">
                                Try a different search term or switch back to the list view for more detailed filtering.
                            </p>
                            <div className="mt-6">
                                <Button
                                    variant="secondary"
                                    onClick={() => setFilters((current) => ({ ...current, search: '', status: 'all' }))}
                                >
                                    Clear Search
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {columns.map((column) => {
                            const columnId = `kanban-column-${column.status.replace(/[^a-zA-Z0-9_-]+/g, '-')}`;

                            return (
                                <section
                                    key={column.status}
                                    className="flex min-h-[28rem] min-w-0 flex-col rounded-xl border border-neutral-200 bg-white/75 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/85 dark:shadow-[0_0_24px_rgba(0,0,0,0.15),0_12px_30px_rgba(0,0,0,0.25)]"
                                    aria-labelledby={columnId}
                                >
                                    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-gray-800">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <span
                                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${columnAccentClasses[column.status] ?? 'bg-primary-500'}`}
                                                aria-hidden="true"
                                            />
                                            <div className="min-w-0">
                                                <h2
                                                    id={columnId}
                                                    className="truncate text-base font-semibold text-neutral-900 dark:text-white"
                                                >
                                                    {column.title}
                                                </h2>
                                                <p className="text-xs text-neutral-500 dark:text-gray-400">
                                                    {column.jobs.length} {column.jobs.length === 1 ? 'application' : 'applications'}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-neutral-100 px-2.5 text-sm font-semibold text-neutral-700 dark:bg-gray-800 dark:text-gray-200">
                                            {column.jobs.length}
                                        </span>
                                    </div>

                                    {column.jobs.length === 0 ? (
                                        <div className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 p-4 text-center text-sm text-neutral-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                                            No applications here.
                                        </div>
                                    ) : (
                                        <div className="mt-3 space-y-3">
                                            {column.jobs.map((job) => (
                                                <KanbanJobCard
                                                    key={job.id}
                                                    job={job}
                                                    isUpdating={savingJobIds.includes(job.id)}
                                                    onStatusChange={handleStatusChange}
                                                    onOpenDetails={handleOpenDetails}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}
            </section>

            <JobForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingJob(undefined);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingJob}
            />

            <Modal
                isOpen={!!selectedJob}
                onClose={handleCloseDetails}
                title={selectedJob ? `${selectedJob.role} at ${selectedJob.company}` : 'Application Details'}
                contentClassName="max-w-4xl"
                bodyClassName="pt-5"
                footerClassName="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                footer={
                    selectedJob ? (
                        <>
                            <Button variant="ghost" onClick={handleCloseDetails}>
                                Close
                            </Button>
                            <Button onClick={() => handleEditJob(selectedJob)}>
                                Edit Application
                            </Button>
                        </>
                    ) : null
                }
            >
                {selectedJob && (
                    <div className="space-y-6">
                        <section className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-400">
                                    Status
                                </p>
                                <div className="mt-3">
                                    <Select
                                        aria-label={`Change status for ${selectedJob.role} at ${selectedJob.company}`}
                                        value={selectedJob.status}
                                        options={getStatusOptions(selectedJob.status)}
                                        onChange={(event) => void handleStatusChange(selectedJob, event.target.value)}
                                        disabled={savingJobIds.includes(selectedJob.id)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-400">
                                    Applied
                                </p>
                                <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                                    {formatDate(selectedJob.applied_at)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-400">
                                    Priority
                                </p>
                                <Button
                                    variant={selectedJob.starred ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => void handleToggleStar(selectedJob.id)}
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={selectedJob.starred ? 'currentColor' : 'none'} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.889a1 1 0 00-.364 1.118l1.519 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.127 10.1c-.783-.57-.38-1.81.588-1.81H7.63a1 1 0 00.95-.69l1.519-4.674z" />
                                    </svg>
                                    {selectedJob.starred ? 'Starred' : 'Mark Starred'}
                                </Button>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Job Description</h3>
                                {selectedJob.job_description?.trim() && (
                                    <span className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                                        Saved
                                    </span>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                {selectedJob.job_description?.trim() || 'No job description saved yet.'}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">Notes</h3>
                            <div className="min-h-24 rounded-xl border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                {selectedJob.notes?.trim() || 'No notes saved yet.'}
                            </div>
                        </section>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function KanbanPage() {
    return (
        <ProtectedRoute>
            <KanbanContent />
        </ProtectedRoute>
    );
}
