import { createDemoJobId, getDemoJobs, saveDemoJobs } from '@/lib/demoStore';
import { JobApplication } from '../types';

export const jobsApi = {
    fetchJobs: async (): Promise<JobApplication[]> => getDemoJobs(),

    insertJob: async (jobData: Omit<JobApplication, 'id'>): Promise<JobApplication> => {
        const job = { ...jobData, id: createDemoJobId() };
        saveDemoJobs([job, ...getDemoJobs()]);
        return job;
    },

    updateJob: async (id: string, jobData: Partial<JobApplication>): Promise<JobApplication> => {
        const jobs = getDemoJobs();
        const existing = jobs.find((job) => job.id === id);
        if (!existing) throw new Error('Application not found.');

        const updated = { ...existing, ...jobData, id };
        saveDemoJobs(jobs.map((job) => (job.id === id ? updated : job)));
        return updated;
    },

    deleteJob: async (id: string): Promise<void> => {
        saveDemoJobs(getDemoJobs().filter((job) => job.id !== id));
    },
};
