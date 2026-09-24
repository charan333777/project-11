import React from 'react';
import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us - Banddle',
    description: 'Get in touch with the Banddle team for support, feedback, or inquiries.',
};

export default function ContactPage() {
    return (
        <div className="app-shell py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Contact Us</h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400">
                        Have questions or feedback? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
