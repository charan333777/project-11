import React, { useId } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className = '',
    id,
    ...props
}) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-neutral-900 transition-smooth focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white ${error ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-gray-700'} ${className}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={errorId}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};
