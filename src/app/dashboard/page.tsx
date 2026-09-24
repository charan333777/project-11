'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useJobs } from '@/features/jobs/hooks/useJobs';
import { JobCard } from '@/features/jobs/components/JobCard';
import { JobForm } from '@/features/jobs/components/JobForm';
import { DeleteConfirmation } from '@/features/jobs/components/DeleteConfirmation';
import { JobFiltersBar } from '@/features/jobs/components/JobFiltersBar';
import { ApplicationsViewToggle } from '@/features/jobs/components/ApplicationsViewToggle';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { FeedbackToast, type FeedbackState } from '@/components/ui/FeedbackToast';
import { formatDate } from '@/lib/utils';
import {
    ApplicationDensity,
    JobApplication,
    JobStatus,
    JOB_STATUS_OPTIONS,
    getJobStatusLabel,
    isCanonicalJobStatus,
} from '@/features/jobs/types';

const DENSITY_STORAGE_KEY = 'banddle-application-density';

const densityOptions: Array<{ value: ApplicationDensity; label: string; columns: string }> = [
    { value: 'comfortable', label: 'Comfortable', columns: '3' },
    { value: 'compact', label: 'Compact', columns: '4' },
    { value: 'dense', label: 'Dense', columns: '5' },
];

const densityGridClasses: Record<ApplicationDensity, string> = {
    comfortable: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    dense: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
};

const isApplicationDensity = (value: string | null): value is ApplicationDensity =>
    value === 'comfortable' || value === 'compact' || value === 'dense';

const DensityDots: React.FC<{ count: number }> = ({ count }) => {
    const gridClass = count === 4 ? 'grid-cols-2' : 'grid-cols-3';

    return (
        <span className={`grid ${gridClass} gap-0.5 text-current`}>
            {Array.from({ length: count }).map((_, index) => (
                <span key={index} className="h-1 w-1 rounded-full bg-current" />
            ))}
        </span>
    );
};

function DashboardContent() {
    const {
        jobs,
        allJobs,
        starredJobs,
        isLoading,
        loadError,
        actionError,
        clearActionError,
        filters,
        setFilters,
        refetchJobs,
        addJob,
        updateJob,
        deleteJob,
        toggleStar,
    } = useJobs();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobApplication | undefined>();
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [density, setDensity] = useState<ApplicationDensity>('comfortable');
    const [hasLoadedDensityPreference, setHasLoadedDensityPreference] = useState(false);
    const [updatingStatusIds, setUpdatingStatusIds] = useState<string[]>([]);

    useEffect(() => {
        if (!feedback) return;

        const timeout = window.setTimeout(() => {
            setFeedback(null);
        }, 4000);

        return () => window.clearTimeout(timeout);
    }, [feedback]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const storedDensity = window.localStorage.getItem(DENSITY_STORAGE_KEY);
            if (isApplicationDensity(storedDensity)) {
                setDensity(storedDensity);
            }
        } catch {
            // Ignore storage issues and keep the default layout.
        }

        setHasLoadedDensityPreference(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedDensityPreference || typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(DENSITY_STORAGE_KEY, density);
        } catch {
            // Ignore storage issues; the current session still updates.
        }
    }, [density, hasLoadedDensityPreference]);

    const showFeedback = (type: FeedbackState['type'], message: string) => {
        setFeedback({ type, message });
    };

    const handleAddJob = () => {
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

    const handleDeleteClick = (id: string) => {
        clearActionError();
        setSelectedJobId(null);
        setDeletingJobId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingJobId) return;

        setIsDeleting(true);

        try {
            await deleteJob(deletingJobId);
            setDeletingJobId(null);
            showFeedback('success', 'Application deleted');
        } finally {
            setIsDeleting(false);
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
            // Error is already surfaced by useJobs via the action error banner.
        }
    };

    const handleStatusChange = async (job: JobApplication, nextStatus: JobStatus) => {
        if (job.status === nextStatus) return;

        clearActionError();
        setUpdatingStatusIds((current) => (current.includes(job.id) ? current : [...current, job.id]));

        try {
            await updateJob(job.id, { status: nextStatus });
            showFeedback('success', `${job.role} moved to ${getJobStatusLabel(nextStatus)}`);
        } catch {
            // Error is already surfaced by useJobs via the action error banner.
        } finally {
            setUpdatingStatusIds((current) => current.filter((id) => id !== job.id));
        }
    };

    const deletingJob = allJobs.find((job) => job.id === deletingJobId);
    const selectedJob = selectedJobId ? allJobs.find((job) => job.id === selectedJobId) ?? null : null;
    const displayedJobs = showStarredOnly ? jobs.filter((job) => !!job.starred) : jobs;
    const gridGapClass = density === 'dense' ? 'gap-4' : density === 'compact' ? 'gap-5' : 'gap-6';

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

    const selectedDensityColumns = densityOptions.find((option) => option.value === density)?.columns ?? '3';
    const selectedDensityCount = Number(selectedDensityColumns);

    if (isLoading) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-neutral-600 dark:text-gray-300 font-medium">Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)] text-center max-w-md border border-neutral-200 dark:border-gray-800">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                    <p className="text-neutral-600 dark:text-gray-300 mb-6">{loadError}</p>
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
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">My Applications</h1>
                            <p className="text-neutral-600 dark:text-gray-300 mt-1">Track and manage your job search</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ApplicationsViewToggle activeView="list" />
                            <label className="relative inline-flex items-center">
                                <span className="sr-only">Cards per row</span>
                                <span
                                    className="pointer-events-none absolute left-3 text-neutral-500 dark:text-gray-400"
                                    aria-hidden="true"
                                >
                                    <DensityDots count={selectedDensityCount} />
                                </span>
                                <select
                                    aria-label="Cards per row"
                                    title={`${selectedDensityColumns} cards per row`}
                                    value={density}
                                    onChange={(event) => setDensity(event.target.value as ApplicationDensity)}
                                    className="h-11 w-[4.75rem] rounded-xl border border-neutral-200 bg-white/80 pl-8 pr-6 text-sm font-semibold text-neutral-800 shadow-sm transition-smooth hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    {densityOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.columns}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <Button
                                variant={showStarredOnly ? 'secondary' : 'ghost'}
                                size="md"
                                onClick={() => setShowStarredOnly((prev) => !prev)}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill={showStarredOnly ? 'currentColor' : 'none'} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.889a1 1 0 00-.364 1.118l1.519 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.519-4.674a1 1 0 00-.364-1.118L2.127 10.1c-.783-.57-.38-1.81.588-1.81H7.63a1 1 0 00.95-.69l1.519-4.674z" />
                                </svg>
                                {showStarredOnly ? 'Show All' : `Starred (${starredJobs.length})`}
                            </Button>
                            <Button onClick={handleAddJob} size="lg">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Application
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="w-full px-6 py-8 sm:px-8 lg:px-12">
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

                <div className="mb-8">
                    <JobFiltersBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        totalJobs={allJobs.length}
                        filteredCount={displayedJobs.length}
                        isStarredOnly={showStarredOnly}
                        onClearStarred={() => setShowStarredOnly(false)}
                    />
                </div>

                {displayedJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-gray-900/90 border dark:border-gray-800 mb-4">
                            <svg className="w-8 h-8 text-neutral-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                            {allJobs.length === 0
                                ? 'No applications yet'
                                : showStarredOnly && starredJobs.length === 0
                                    ? 'No starred applications'
                                    : 'No matching applications'}
                        </h3>
                        <p className="text-neutral-600 dark:text-gray-300 mb-6">
                            {allJobs.length === 0
                                ? 'Start tracking your job applications by adding your first one.'
                                : showStarredOnly && starredJobs.length === 0
                                    ? 'Star important applications to keep them easy to access from this view.'
                                    : 'Try adjusting your search, status, or starred filter to see more results.'}
                        </p>
                        {allJobs.length === 0 ? (
                            <Button onClick={handleAddJob}>
                                Add Your First Application
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setFilters({ search: '', status: 'all', sort: filters.sort });
                                        setShowStarredOnly(false);
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                                {showStarredOnly && starredJobs.length === 0 && (
                                    <Button variant="ghost" onClick={() => setShowStarredOnly(false)}>
                                        Back to All Applications
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`grid ${densityGridClasses[density]} ${gridGapClass}`}>
                        {displayedJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                density={density}
                                onToggleStar={(id) => void handleToggleStar(id)}
                                onOpenDetails={handleOpenDetails}
                                isStarred={!!job.starred}
                            />
                        ))}
                    </div>
                )}
            </main>

            <JobForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingJob(undefined);
                }}
                onSubmit={handleFormSubmit}
                initialData={editingJob}
            />

            <DeleteConfirmation
                isOpen={!!deletingJobId}
                onClose={() => setDeletingJobId(null)}
                onConfirm={() => void handleDeleteConfirm()}
                isDeleting={isDeleting}
                jobTitle={deletingJob ? `${deletingJob.role} at ${deletingJob.company}` : ''}
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
                            <Button variant="secondary" onClick={() => handleDeleteClick(selectedJob.id)}>
                                Delete
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
                                        disabled={updatingStatusIds.includes(selectedJob.id)}
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

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
