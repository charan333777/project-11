'use client';

import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
    return (
        <section className="relative border-b border-neutral-200 bg-white/90 px-6 py-16 shadow-[0_22px_70px_rgba(15,23,42,0.08)] dark:border-transparent dark:bg-transparent dark:shadow-none sm:py-20">
            <div className="max-w-4xl mx-auto text-center">
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight">
                    Track Your Job Applications
                    <br />
                    <span className="text-primary-600">All in One Place</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto">
                    Stay organized during your job search. Manage applications, track statuses,
                    and never miss a follow-up with Banddle.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/signup"
                        className="w-full rounded-lg bg-primary-600 px-8 py-3 text-center font-medium text-white transition-smooth shadow-lg shadow-primary-200 hover:bg-primary-700 sm:w-auto"
                    >
                        Start Tracking for Free
                    </Link>
                    <Link
                        href="/login"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-8 py-3 text-center font-medium text-neutral-700 transition-smooth hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 sm:w-auto"
                    >
                        Login
                    </Link>
                </div>

                {/* Trust Badge */}
                <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
                    No credit card required • Free forever
                </p>
            </div>
        </section>
    );
};
