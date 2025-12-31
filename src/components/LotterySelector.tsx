import React from 'react';
import { LOTTERY_CONFIGS } from '../config/lotteries';
import type { LotteryType } from '../types';
import { motion } from 'framer-motion';

interface LotterySelectorProps {
    selected: LotteryType;
    onSelect: (type: LotteryType) => void;
}

export const LotterySelector: React.FC<LotterySelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex gap-3 px-1 min-w-max">
                {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).map((key) => {
                    const config = LOTTERY_CONFIGS[key];
                    const isSelected = selected === key;
                    const baseColor = config.primaryColor.split('-')[0]; // e.g. "emerald" from "emerald-500"

                    // Map generic tailwind colors to specific classes since dynamic string interpolation 
                    // like `bg-${baseColor}-500` is discouraged/purged in Tailwind.
                    // Instead we use `config.primaryColor` assuming it's a valid Utility Class if we had safelist,
                    // BUT Shadcn/Tailwind JIT needs complete class names.
                    // Exception: we can use style API for dynamic colors OR pre-defined map.
                    // Given the constraint, let's just use the `primaryColor` field which usually contains specific class "emerald-500".
                    // Wait, `bg-emerald-500` works if the class is safe.

                    return (
                        <button
                            key={key}
                            onClick={() => onSelect(key)}
                            className={`
                                relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                                border
                                ${isSelected
                                    ? `bg-zinc-800 text-white border-zinc-600 shadow-lg shadow-${baseColor}-500/20`
                                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                                }
                            `}
                        >
                            {isSelected && (
                                <span className={`absolute inset-0 rounded-full opacity-20 bg-${baseColor}-500 blur-sm`}></span>
                            )}
                            <div className="flex items-center gap-2 relative z-10">
                                <div
                                    className={`w-2 h-2 rounded-full ${isSelected ? `bg-${baseColor}-500` : 'bg-zinc-600'}`}
                                    // Use inline style for dynamic color fallback if Tailwind purges it
                                    style={{ backgroundColor: isSelected ? '' : '' }}
                                />
                                {config.name}
                            </div>

                            {/* Active Indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-${baseColor}-400 mb-1`}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
