import React from 'react';
import { cn } from '../lib/utils';

interface PriceDisplayProps {
    amount: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    label?: string;
    highlight?: boolean;
}

const SIZE_CLASSES = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
    amount,
    size = 'md',
    className,
    label,
    highlight = false
}) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                    {label}
                </span>
            )}
            <span
                className={cn(
                    "font-mono font-bold tabular-nums",
                    SIZE_CLASSES[size],
                    highlight
                        ? "text-emerald-500"
                        : "text-slate-100"
                )}
            >
                {formatted}
            </span>
        </div>
    );
};
