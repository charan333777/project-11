import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Banddle',
    description: 'Learn how Banddle collects, uses, and protects your information.',
};

export default function PrivacyPolicy() {
    return (
        <div className="app-shell py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Privacy Policy</h1>
                
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">1. Introduction</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            At Banddle, we respect your privacy and are committed to protecting your personal data. 
                            We only collect data that is strictly necessary to provide our job application tracking service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">2. Information We Collect</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                            We collect the following types of information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                            <li><strong>Account Information:</strong> Your email address and name provided during signup.</li>
                            <li><strong>Job Application Data:</strong> Information you enter about your job applications, such as company names, positions, statuses, dates, and notes.</li>
                            <li><strong>Usage Data:</strong> Anonymous technical data used to improve our service and platform performance.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">3. How We Use Information</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                            Your information is used solely to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                            <li>Provide and maintain the application tracking features.</li>
                            <li>Create and manage your user account.</li>
                            <li>Personalize your experience on the platform.</li>
                            <li>Analyze usage to improve our platform&apos;s functionality.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">4. Data Security</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            This frontend-only demonstration stores sample account and application data in your
                            browser&apos;s local storage. Do not enter real personal, confidential, or sensitive data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">5. Contact</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            If you have any questions or concerns regarding this Privacy Policy, please contact us at:
                            <br />
                            <a href="mailto:support@banddle.com" className="text-primary-600 hover:text-primary-700 font-medium">
                                support@banddle.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
