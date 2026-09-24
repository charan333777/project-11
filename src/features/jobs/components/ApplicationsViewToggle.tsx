'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ApplicationsViewToggleProps {
    activeView: 'list' | 'kanban';
    className?: string;
}

const links = [
    { href: '/dashboard', label: 'List View', view: 'list' as const },
    { href: '/dashboard/kanban', label: 'Kanban View', view: 'kanban' as const },
];

export const ApplicationsViewToggle: React.FC<ApplicationsViewToggleProps> = ({
    activeView,
    className,
}) => {
    return (
        <div
            className={cn(
                'inline-flex rounded-xl border border-neutral-200 bg-white/80 p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900/90',
                className
            )}
            aria-label="Applications view"
        >
            {links.map((link) => {
                const isActive = link.view === activeView;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'rounded-lg px-4 py-2 text-sm font-medium transition-smooth',
                            isActive
                                ? 'bg-primary-600 text-white shadow-sm dark:bg-blue-600'
                                : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-300'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
};
