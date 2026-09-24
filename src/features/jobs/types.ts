export const JOB_STATUS_VALUES = ['applied', 'interview', 'offer', 'rejected'] as const;

export type CanonicalJobStatus = (typeof JOB_STATUS_VALUES)[number];
export type JobStatus = CanonicalJobStatus | string;
export type SortOption = 'date-desc' | 'date-asc' | 'company' | 'status';
export type ApplicationDensity = 'comfortable' | 'compact' | 'dense';

export const JOB_STATUS_LABELS: Record<CanonicalJobStatus, string> = {
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
};

export const JOB_STATUS_OPTIONS: Array<{ value: CanonicalJobStatus; label: string }> = JOB_STATUS_VALUES.map(
    (value) => ({
        value,
        label: JOB_STATUS_LABELS[value],
    })
);

export const JOB_STATUS_FILTER_OPTIONS: Array<{ value: JobStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    ...JOB_STATUS_OPTIONS,
];

export const JOB_SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'company', label: 'Company A-Z' },
    { value: 'status', label: 'Status' },
];

const formatCustomStatusLabel = (status: string) =>
    status
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const isCanonicalJobStatus = (status: JobStatus): status is CanonicalJobStatus =>
    JOB_STATUS_VALUES.includes(status as CanonicalJobStatus);

export const getJobStatusLabel = (status: JobStatus) => {
    if (!status) {
        return 'Unknown';
    }

    if (isCanonicalJobStatus(status)) {
        return JOB_STATUS_LABELS[status];
    }

    return formatCustomStatusLabel(status);
};

// Job Application Interface (Mapped to public.applications table)
export interface JobApplication {
    id: string;
    company: string;
    role: string;           // DB column: role
    status: JobStatus;
    applied_at: string;     // DB column: applied_at
    starred?: boolean;
    job_description?: string | null;
    notes?: string;
    salary?: number;        // DB column: salary
    stage?: string;         // DB column: stage
    updated_at?: string;    // DB column: updated_at
}

export interface JobFilters {
    search: string;
    status: JobStatus | 'all';
    sort: SortOption;
}
