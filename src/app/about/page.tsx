import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Banddle',
    description: 'Learn more about Banddle and our mission to help job seekers.',
};

export default function AboutPage() {
    return (
        <div className="app-shell py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">About Banddle</h1>
                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Banddle helps job seekers keep their search organized, visible, and easier to manage from first application to final decision.
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 md:p-12 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Why Banddle Exists</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Job searching already comes with enough uncertainty. Tracking applications across spreadsheets, notes, email threads,
                            and bookmarked job posts only adds more friction. Banddle was built to give that process one clear home.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">What It Helps You Do</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                            Banddle is designed for the practical side of the job hunt: recording where you applied, tracking status changes,
                            saving important notes, and quickly finding the opportunities you need to revisit.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Track every application</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Keep company names, roles, and application dates in one organized dashboard.
                                </p>
                            </div>
                            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Stay on top of progress</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Monitor where each application stands, from applied to interview, offer, or rejection.
                                </p>
                            </div>
                            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Keep context attached</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Save notes, salary details, and supporting links so important context does not get lost.
                                </p>
                            </div>
                            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Find what matters fast</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Search and filter your pipeline without digging through scattered documents.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Who It&apos;s For</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Banddle is for anyone actively applying to jobs and wanting a simpler system than a spreadsheet. Whether you are
                            sending a few carefully chosen applications or managing a large pipeline, the goal is the same: stay organized and
                            reduce the mental overhead of your search.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">👋 Built by</h2>
                        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5">
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Hi, I&apos;m Saicharan — the developer behind Banddle. I built this tool to simplify the chaos of job searching after seeing how scattered and overwhelming the process can be. Banddle is designed to bring everything into one place so you can stay organized and focused. If you have feedback or want to connect, feel free to reach out on LinkedIn.
                            </p>
                            <a
                                href="https://www.linkedin.com/in/saicharan-duduka-b02204233"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 font-medium text-white shadow-sm transition-smooth hover:bg-primary-700"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9.5 6H6.75v8.25H9.5V9zm.18-2.55a1.59 1.59 0 10-3.18 0 1.59 1.59 0 003.18 0zM17.25 12c0-2.48-1.32-3.63-3.08-3.63-1.42 0-2.06.78-2.42 1.33V9H9v8.25h2.75v-4.08c0-1.08.2-2.13 1.53-2.13 1.31 0 1.33 1.22 1.33 2.2v4.01h2.75V12z" />
                                </svg>
                                Connect on LinkedIn
                            </a>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-3">Ready to organize your job search?</h2>
                        <p className="text-primary-50 mb-6 max-w-2xl mx-auto">
                            Start tracking applications, statuses, notes, and progress in one place with a workflow built for job seekers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/signup"
                                className="inline-block px-8 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-smooth"
                            >
                                Start Tracking for Free
                            </Link>
                            <Link
                                href="/login"
                                className="inline-block px-8 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-smooth"
                            >
                                Log In to Dashboard
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
