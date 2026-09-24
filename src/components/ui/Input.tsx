import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    id,
    ...props
}) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-neutral-900 transition-smooth focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 ${error ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-gray-700'
                    } ${className}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={errorId}
                {...props}
            />
            {error && (
                <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};
