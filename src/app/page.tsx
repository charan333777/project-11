import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';

export default function Home() {
    return (
        <div className="app-shell">
            <Hero />
            <Features />

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center glass rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        Ready to Get Organized?
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                        Join thousands of job seekers who trust Banddle to manage their applications
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-smooth shadow-lg shadow-primary-200"
                    >
                        Start Tracking for Free
                    </Link>
                </div>
            </section>
        </div>
    );
}
