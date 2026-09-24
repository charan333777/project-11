'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    error?: string;
    autoFocus?: boolean;
    className?: string;
}

const createEmptyDigits = (length: number) => Array.from({ length }, () => '');

const toDigitArray = (value: string, length: number) => {
    const digits = createEmptyDigits(length);
    const sanitizedValue = value.replace(/\D/g, '').slice(0, length);

    sanitizedValue.split('').forEach((digit, index) => {
        digits[index] = digit;
    });

    return digits;
};

export const OtpInput: React.FC<OtpInputProps> = ({
    value,
    onChange,
    length = 6,
    disabled = false,
    error,
    autoFocus = true,
    className = '',
}) => {
    const [digits, setDigits] = useState<string[]>(() => toDigitArray(value, length));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const hasAutofocused = useRef(false);

    const focusInput = (index: number) => {
        const input = inputRefs.current[index];

        if (!input) return;

        input.focus();
        input.select();
    };

    const commitDigits = (nextDigits: string[], focusIndex?: number) => {
        setDigits(nextDigits);
        onChange(nextDigits.join(''));

        if (focusIndex === undefined) return;

        window.requestAnimationFrame(() => {
            focusInput(focusIndex);
        });
    };

    useEffect(() => {
        const sanitizedValue = value.replace(/\D/g, '').slice(0, length);

        if (!sanitizedValue) {
            setDigits(createEmptyDigits(length));
            return;
        }

        if (sanitizedValue.length === length) {
            setDigits(toDigitArray(sanitizedValue, length));
        }
    }, [length, value]);

    useEffect(() => {
        if (!value) {
            hasAutofocused.current = false;
        }
    }, [value]);

    useEffect(() => {
        if (!autoFocus || disabled || hasAutofocused.current) return;

        const timeout = window.setTimeout(() => {
            const firstEmptyIndex = digits.findIndex((digit) => !digit);
            const focusIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
            focusInput(focusIndex);
            hasAutofocused.current = true;
        }, 0);

        return () => window.clearTimeout(timeout);
    }, [autoFocus, digits, disabled]);

    const handleChange = (index: number, nextValue: string) => {
        const sanitizedValue = nextValue.replace(/\D/g, '');

        if (!sanitizedValue) {
            const nextDigits = [...digits];
            nextDigits[index] = '';
            commitDigits(nextDigits);
            return;
        }

        const nextDigits = [...digits];

        sanitizedValue.slice(0, length - index).split('').forEach((digit, offset) => {
            nextDigits[index + offset] = digit;
        });

        const nextFocusIndex = Math.min(index + sanitizedValue.length, length - 1);
        commitDigits(nextDigits, nextFocusIndex);
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            event.preventDefault();

            const nextDigits = [...digits];

            if (nextDigits[index]) {
                nextDigits[index] = '';
                commitDigits(nextDigits);
                return;
            }

            const previousIndex = Math.max(index - 1, 0);
            nextDigits[previousIndex] = '';
            commitDigits(nextDigits, previousIndex);
            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusInput(Math.max(index - 1, 0));
            return;
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusInput(Math.min(index + 1, length - 1));
        }
    };

    const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - index);

        if (!pastedValue) return;

        const nextDigits = [...digits];

        pastedValue.split('').forEach((digit, offset) => {
            nextDigits[index + offset] = digit;
        });

        const nextFocusIndex = Math.min(index + pastedValue.length, length - 1);
        commitDigits(nextDigits, nextFocusIndex);
    };

    return (
        <div className={cn('w-full', className)}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(input) => {
                            inputRefs.current[index] = input;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        disabled={disabled}
                        aria-label={`Digit ${index + 1} of ${length}`}
                        onChange={(event) => handleChange(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onPaste={(event) => handlePaste(index, event)}
                        onFocus={(event) => event.target.select()}
                        className={cn(
                            'h-11 w-11 rounded-xl border bg-white text-center text-base font-semibold text-neutral-900 shadow-sm transition-smooth focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-900 dark:text-white sm:h-14 sm:w-14 sm:text-xl',
                            error ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-gray-700',
                            disabled && 'cursor-not-allowed opacity-60',
                        )}
                    />
                ))}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
