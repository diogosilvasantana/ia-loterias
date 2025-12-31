import React from 'react';
import { cn } from "../lib/utils";

interface LotteryBallProps {
    number: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    selected?: boolean;
}

const SIZE_CLASSES = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
};

export const LotteryBall: React.FC<LotteryBallProps> = ({
    number,
    size = 'md',
    className,
    selected = false
}) => {
    return (
        <div className={cn(
            // Base styles - Monochrome Premium
            "rounded-full flex items-center justify-center font-mono font-bold transition-all duration-200",
            "border-2",
            SIZE_CLASSES[size],

            // Normal state - Subtle dark gray
            !selected && "bg-slate-900 border-slate-700 text-slate-200",

            // Selected state - Golden premium
            selected && "bg-slate-950 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]",

            // Hover effect
            "hover:scale-105 hover:border-slate-600",

            className
        )}>
            <span className="relative z-10">
                {String(number).padStart(2, '0')}
            </span>
        </div>
    );
};
