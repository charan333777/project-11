'use client';

import React from 'react';
import {
    JobFilters,
    JobStatus,
    SortOption,
    JOB_SORT_OPTIONS,
    JOB_STATUS_FILTER_OPTIONS,
    getJobStatusLabel,
} from '../types';
import { Select } from '@/components/ui/Select';

interface JobFiltersBarProps {
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
    totalJobs: number;
    filteredCount: number;
    isStarredOnly?: boolean;
    onClearStarred?: () => void;
}

export const JobFiltersBar: React.FC<JobFiltersBarProps> = ({
    filters,
    onFiltersChange,
    totalJobs,
    filteredCount,
    isStarredOnly = false,
    onClearStarred,
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const handleClearSearch = () => {
        onFiltersChange({ ...filters, search: '' });
    };

    const handleClearStatus = () => {
        onFiltersChange({ ...filters, status: 'all' });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, status: e.target.value as JobStatus | 'all' });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, sort: e.target.value as SortOption });
    };

    const hasActiveFilters =
        isStarredOnly || !!filters.search.trim() || filters.status !== 'all';
    const trimmedSearch = filters.search.trim();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                <div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-neutral-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by company or position..."
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-10 text-neutral-900 transition-smooth focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        />
                        {filters.search && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 transition-smooth hover:text-neutral-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300"
                                aria-label="Clear search"
                                type="button"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full">
                    <Select
                        options={JOB_STATUS_FILTER_OPTIONS}
                        value={filters.status}
                        onChange={handleStatusChange}
                    />
                </div>

                <div className="w-full">
                    <Select
                        options={JOB_SORT_OPTIONS}
                        value={filters.sort}
                        onChange={handleSortChange}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-neutral-600 dark:text-gray-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p>
                    Showing <span className="font-semibold">{filteredCount}</span> of{' '}
                    <span className="font-semibold">{totalJobs}</span> applications
                </p>

                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-500">
                            Filtered by
                        </span>

                        {isStarredOnly && onClearStarred && (
                            <FilterChip
                                label="Starred"
                                onClear={onClearStarred}
                                dismissLabel="Clear starred filter"
                            />
                        )}

                        {filters.status !== 'all' && (
                            <FilterChip
                                label={`Status: ${getJobStatusLabel(filters.status)}`}
                                onClear={handleClearStatus}
                                dismissLabel="Clear status filter"
                            />
                        )}

                        {trimmedSearch && (
                            <FilterChip
                                label={`Search: “${trimmedSearch}”`}
                                onClear={handleClearSearch}
                                dismissLabel="Clear search filter"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

interface FilterChipProps {
    label: string;
    onClear: () => void;
    dismissLabel: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onClear, dismissLabel }) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
        {label}
        <button
            type="button"
            onClick={onClear}
            className="rounded-full p-0.5 text-primary-500 transition-smooth hover:bg-primary-100 hover:text-primary-700 dark:text-blue-300 dark:hover:bg-blue-900/50"
            aria-label={dismissLabel}
        >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </span>
);
