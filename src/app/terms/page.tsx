import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - Banddle',
    description: 'Read the terms and conditions for using the Banddle platform.',
};

export default function TermsOfService() {
    return (
        <div className="app-shell py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Terms of Service</h1>
                
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">1. Acceptance of Terms</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            By accessing or using Banddle, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">2. Use of the Service</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            You agree to use Banddle responsibly and only for lawful purposes. You are prohibited from violating or attempting to violate the security of the service or interfering with other users&apos; access.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">3. User Accounts</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            To use certain features of Banddle, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">4. Data Responsibility</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            You are solely responsible for the job application data and any other content you store on the platform. Banddle does not claim ownership of your data, but you grant us the right to store and process it to provide the service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">5. Service Availability</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Banddle is a continuously evolving platform. We reserve the right to update, modify, or improve the service at any time. We do not guarantee uninterrupted availability of the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">6. Limitation of Liability</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Banddle is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind. To the maximum extent permitted by law, Banddle shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
