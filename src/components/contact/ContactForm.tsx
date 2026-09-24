'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { saveDemoContactMessage } from '@/lib/demoStore';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

const emptyForm: ContactFormData = { name: '', email: '', message: '' };

export const ContactForm: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ContactFormData>(emptyForm);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            saveDemoContactMessage({
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim(),
            });

            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again or email us directly at support@banddle.com.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    if (submitted) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Message Received!</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    Demo message saved in this browser for <strong>{formData.email}</strong>.
                </p>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setSubmitted(false);
                        setFormData(emptyForm);
                    }}
                >
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="name"
                label="Name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
            />
            <Input
                id="email"
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
            />
            <TextArea
                id="message"
                label="Message"
                name="message"
                placeholder="How can we help?"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
            />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
};
