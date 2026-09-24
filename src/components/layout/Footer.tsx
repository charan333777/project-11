import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-neutral-200 dark:border-gray-800 pt-16 pb-8 px-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">Banddle</span>
                        </Link>
                        <p className="text-neutral-600 dark:text-gray-300 max-w-xs transition-colors">
                            Manage your job search journey with ease. Track applications, organize details, and land your dream job.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-neutral-900 dark:text-white">Product</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-neutral-900 dark:text-white">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-neutral-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 dark:text-gray-500 text-sm">
                        Banddle © {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
};
