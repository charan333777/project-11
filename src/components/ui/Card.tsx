import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    glass = false,
    ...props
}) => {
    const baseStyles = 'rounded-xl p-6';
    const glassStyles = glass ? 'glass' : 'bg-white border border-neutral-200 shadow-md dark:bg-gray-900 dark:border-gray-800 dark:shadow-[0_0_30px_rgba(0,0,0,0.3),0_18px_36px_rgba(0,0,0,0.45)]';
    const hoverStyles = hover ? 'card-hover cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
