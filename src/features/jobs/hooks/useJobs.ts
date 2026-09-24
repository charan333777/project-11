'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { JobApplication, JobFilters } from '../types';
import { jobsApi } from '../lib/jobsApi';
import { useAuth } from '@/lib/auth/AuthContext';
import { getErrorMessage } from '@/lib/utils';

export const useJobs = () => {
    const { isAuthenticated } = useAuth();
    const [jobs, setJobs] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const [filters, setFilters] = useState<JobFilters>({
        search: '',
        status: 'all',
        sort: 'date-desc',
    });

    const refetchJobs = useCallback(async () => {
        if (!isAuthenticated) {
            setJobs([]);
            setLoadError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setLoadError(null);

        try {
            const data = await jobsApi.fetchJobs();
            setJobs(data);
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to fetch applications');

            console.error('Failed to fetch applications:', error);
            setLoadError(message);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        void refetchJobs();
    }, [refetchJobs]);

    const addJob = async (jobData: Omit<JobApplication, 'id'>) => {
        setActionError(null);

        try {
            const newJob = await jobsApi.insertJob(jobData);
            setJobs((prev) => [newJob, ...prev]);
            return newJob;
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to add application');

            console.error('Failed to add application:', error);
            setActionError(message);
            throw new Error(message);
        }
    };

    const updateJob = async (id: string, jobData: Partial<JobApplication>) => {
        setActionError(null);

        try {
            const updatedJob = await jobsApi.updateJob(id, jobData);
            setJobs((prev) =>
                prev.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
            );
            return updatedJob;
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to update application');

            console.error('Failed to update application:', error);
            setActionError(message);
            throw new Error(message);
        }
    };

    const deleteJob = async (id: string) => {
        setActionError(null);

        try {
            await jobsApi.deleteJob(id);
            setJobs((prev) => prev.filter((job) => job.id !== id));
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to delete application');

            console.error('Failed to delete application:', error);
            setActionError(message);
            throw new Error(message);
        }
    };

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        const getAppliedAtTime = (dateValue?: string) => {
            if (!dateValue) return 0;

            const timestamp = new Date(dateValue).getTime();
            return Number.isNaN(timestamp) ? 0 : timestamp;
        };

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (job) =>
                    job.company.toLowerCase().includes(searchLower) ||
                    job.role.toLowerCase().includes(searchLower)
            );
        }

        if (filters.status !== 'all') {
            result = result.filter((job) => job.status === filters.status);
        }

        switch (filters.sort) {
            case 'date-desc':
                result.sort((a, b) => getAppliedAtTime(b.applied_at) - getAppliedAtTime(a.applied_at));
                break;
            case 'date-asc':
                result.sort((a, b) => getAppliedAtTime(a.applied_at) - getAppliedAtTime(b.applied_at));
                break;
            case 'company':
                result.sort((a, b) => a.company.localeCompare(b.company));
                break;
            case 'status':
                result.sort((a, b) => a.status.localeCompare(b.status));
                break;
        }

        return result;
    }, [jobs, filters]);

    const starredJobs = useMemo(
        () => jobs.filter((job) => !!job.starred),
        [jobs]
    );

    const toggleStar = async (id: string) => {
        const targetJob = jobs.find((job) => job.id === id);
        if (!targetJob) return;

        setActionError(null);

        try {
            const updatedJob = await jobsApi.updateJob(id, { starred: !targetJob.starred });
            setJobs((prev) =>
                prev.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
            );
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to update star');

            console.error('Failed to update star:', error);
            setActionError(message);
            throw new Error(message);
        }
    };

    const saveJobDescription = async (id: string, description: string) => {
        setActionError(null);

        try {
            const updatedJob = await jobsApi.updateJob(id, {
                job_description: description.trim() ? description : null,
            });
            setJobs((prev) =>
                prev.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
            );
            return updatedJob;
        } catch (error) {
            const message = getErrorMessage(error, 'Failed to save job description');

            console.error('Failed to save job description:', error);
            setActionError(message);
            throw new Error(message);
        }
    };

    return {
        jobs: filteredJobs,
        allJobs: jobs,
        starredJobs,
        isLoading,
        loadError,
        actionError,
        clearActionError: () => setActionError(null),
        filters,
        setFilters,
        refetchJobs,
        addJob,
        updateJob,
        deleteJob,
        toggleStar,
        saveJobDescription,
    };
};
