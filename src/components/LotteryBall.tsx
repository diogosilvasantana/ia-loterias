import React from 'react';
import { cn } from "../lib/utils"; // Assuming standard Shadcn utils location or I will create it

interface LotteryBallProps {
    number: number;
    color?: string; // Default to standard lottery colors if not provided
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZE_CLASSES = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
};

const getBallColor = (num: number): string => {
    // Standard Mega-Sena colors logic strictly for visual pop
    const n = num % 10;
    switch (n) {
        case 1: return 'from-red-500 to-red-600 border-red-400';
        case 2: return 'from-yellow-400 to-yellow-500 border-yellow-300';
        case 3: return 'from-green-500 to-green-600 border-green-400';
        case 4: return 'from-blue-500 to-blue-600 border-blue-400';
        case 5: return 'from-blue-700 to-blue-800 border-blue-500'; // Dark Blue roughly
        case 6: return 'from-pink-500 to-pink-600 border-pink-400';
        case 7: return 'from-black to-slate-900 border-slate-600';
        case 8: return 'from-slate-400 to-slate-500 border-slate-300';
        case 9: return 'from-orange-500 to-orange-600 border-orange-400';
        case 0: return 'from-white to-slate-200 border-slate-100 text-slate-900'; // White ball needs dark text
        default: return 'from-slate-700 to-slate-800';
    }
};

export const LotteryBall: React.FC<LotteryBallProps> = ({ number, size = 'md', className }) => {
    const colorClass = getBallColor(number);
    const isWhite = number % 10 === 0;

    return (
        <div className={cn(
            "rounded-full flex items-center justify-center font-bold shadow-lg relative overflow-hidden transition-transform hover:scale-105",
            "bg-gradient-to-br border-t",
            colorClass,
            SIZE_CLASSES[size],
            isWhite ? "text-slate-900" : "text-white shadow-black/30",
            className
        )}>
            {/* Shine effect for 3D */}
            <div className="absolute top-1 left-2 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px]" />
            <div className="absolute bottom-1 right-2 w-1/3 h-1/3 bg-black/10 rounded-full blur-[2px]" />

            <span className="relative z-10 drop-shadow-sm">
                {String(number).padStart(2, '0')}
            </span>
        </div>
    );
};
