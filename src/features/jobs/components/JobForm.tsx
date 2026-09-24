'use client';

import React, { useEffect, useId, useState } from 'react';
import { JobApplication, JOB_STATUS_OPTIONS } from '../types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/utils';

interface JobFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jobData: Omit<JobApplication, 'id'>) => Promise<void>;
    initialData?: JobApplication;
}

interface JobFormErrors {
    company?: string;
    role?: string;
    applied_at?: string;
    form?: string;
}

export const JobForm: React.FC<JobFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const formId = useId();

    const formatDateForInput = (dateValue?: string) => {
        if (!dateValue) return new Date().toISOString().split('T')[0];
        return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
    };

    const [formData, setFormData] = useState<Omit<JobApplication, 'id'>>({
        company: '',
        role: '',
        status: 'applied',
        applied_at: formatDateForInput(),
        notes: '',
        job_description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<JobFormErrors>({});

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setFormData({
                company: initialData.company,
                role: initialData.role,
                status: initialData.status,
                applied_at: formatDateForInput(initialData.applied_at),
                notes: initialData.notes ?? '',
                job_description: initialData.job_description ?? '',
            });
        } else {
            setFormData({
                company: '',
                role: '',
                status: 'applied',
                applied_at: formatDateForInput(),
                notes: '',
                job_description: '',
            });
        }

        setErrors({});
        setIsSubmitting(false);
    }, [isOpen, initialData]);

    const handleClose = () => {
        if (isSubmitting) return;

        setErrors({});
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedCompany = formData.company.trim();
        const trimmedRole = formData.role.trim();
        const nextErrors: JobFormErrors = {};

        if (!trimmedCompany) {
            nextErrors.company = 'Company name is required';
        }

        if (!trimmedRole) {
            nextErrors.role = 'Position is required';
        }

        if (!formData.applied_at) {
            nextErrors.applied_at = 'Applied date is required';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit({
                ...formData,
                company: trimmedCompany,
                role: trimmedRole,
                notes: (formData.notes ?? '').trim(),
                job_description: formData.job_description?.trim()
                    ? formData.job_description.trim()
                    : null,
            });
            onClose();
        } catch (error) {
            const message = getErrorMessage(
                error,
                initialData ? 'Failed to update application' : 'Failed to add application'
            );

            console.error('Application form submission failed:', error);
            setErrors({ form: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData ? 'Edit Application' : 'Add New Application'}
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={formId} disabled={isSubmitting}>
                        {isSubmitting
                            ? (initialData ? 'Saving...' : 'Adding...')
                            : `${initialData ? 'Update' : 'Add'} Application`}
                    </Button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit} className="space-y-6" noValidate>
                <section className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-400">
                        Application details
                    </h3>

                    <Input
                        label="Company Name *"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g., Google"
                        error={errors.company}
                        disabled={isSubmitting}
                        required
                    />

                    <Input
                        label="Position *"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer"
                        error={errors.role}
                        disabled={isSubmitting}
                        required
                    />
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-gray-400">
                        Status &amp; timeline
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={JOB_STATUS_OPTIONS}
                            disabled={isSubmitting}
                        />

                        <Input
                            label="Applied on *"
                            name="applied_at"
                            type="date"
                            value={formData.applied_at}
                            onChange={handleChange}
                            error={errors.applied_at}
                            disabled={isSubmitting}
                            required
                        />
                    </div>
                </section>

                <section className="space-y-2">
                    <TextArea
                        label="Job Description"
                        name="job_description"
                        value={formData.job_description ?? ''}
                        onChange={handleChange}
                        placeholder="Paste the full job description, responsibilities, requirements, salary details, and useful links..."
                        rows={7}
                        disabled={isSubmitting}
                    />
                </section>

                <section className="space-y-2">
                    <TextArea
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Recruiter name, interview stage, follow-up reminders…"
                        rows={4}
                        disabled={isSubmitting}
                    />
                </section>

                {errors.form && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                        {errors.form}
                    </div>
                )}
            </form>
        </Modal>
    );
};
