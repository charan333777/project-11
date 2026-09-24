'use client';

import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    contentClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    contentClassName = '',
    bodyClassName = '',
    footerClassName = '',
}) => {
    const titleId = useId();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Guard: don't render if closed, or during SSR (document not available)
    if (!isOpen || typeof document === 'undefined') return null;

    /*
     * Portal: renders directly on document.body, breaking out of any ancestor
     * stacking context (e.g. the `.app-shell { isolate }` utility) so the modal
     * always appears above the sticky header regardless of z-index scoping.
     */
    return createPortal(
        <div className="fixed inset-0 z-[200] overflow-y-auto animate-fade-in">
            {/* Backdrop — fixed so it always covers the full viewport */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/*
             * Centering wrapper — min-h-full + items-center vertically centres
             * short modals; tall modals push this div taller than the viewport
             * and the outer overflow-y-auto handles the scroll.
             */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal panel */}
                <div
                    className={`relative glass flex max-h-[90vh] w-full max-w-2xl animate-slide-up flex-col rounded-2xl text-neutral-900 dark:text-white ${contentClassName}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    {/* Header — always pinned */}
                    <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 p-6 dark:border-gray-800">
                        <h2 id={titleId} className="text-2xl font-semibold text-neutral-900 dark:text-white">
                            {title}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-neutral-500 transition-smooth hover:text-neutral-700 dark:text-gray-400 dark:hover:text-white"
                            aria-label="Close dialog"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body — scrolls when content exceeds available height */}
                    <div className={`p-6 overflow-y-auto flex-1 min-h-0 ${bodyClassName}`}>
                        {children}
                    </div>

                    {/* Footer — always pinned */}
                    {footer && (
                        <div className={`flex shrink-0 items-center justify-end gap-3 border-t border-neutral-200 p-6 dark:border-gray-800 ${footerClassName}`}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
