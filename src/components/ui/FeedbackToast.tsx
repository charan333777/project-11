'use client';

import React from 'react';

export interface FeedbackState {
    message: string;
    type: 'error' | 'success';
}

interface FeedbackToastProps {
    feedback: FeedbackState;
    onDismiss: () => void;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ feedback, onDismiss }) => {
    const isSuccess = feedback.type === 'success';

    return (
        <div className="fixed right-6 top-24 z-50 w-[calc(100%-3rem)] max-w-sm animate-slide-up">
            <div
                className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
                    isSuccess
                        ? 'border-green-200 dark:border-green-900 bg-white/95 dark:bg-gray-900/95 text-neutral-900 dark:text-white'
                        : 'border-red-200 dark:border-red-900 bg-white/95 dark:bg-gray-900/95 text-neutral-900 dark:text-white'
                }`}
                role={isSuccess ? 'status' : 'alert'}
                aria-live={isSuccess ? 'polite' : 'assertive'}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            isSuccess ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {isSuccess ? 'Success' : 'Error'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-gray-300">{feedback.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="rounded-full p-1 text-neutral-400 transition-smooth hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        aria-label="Dismiss notification"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
