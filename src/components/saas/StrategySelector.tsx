import React from 'react';
import type { IntelligenceMode } from '../../types/engine';
import { useStore } from '../../store';
// import { Button } from '../../components/ui/button'; // Assuming Shadcn

// Minimal definition if UI components missing, but user said "Shadcn/ui" is part of stack.
// I will assume existing UI components or use standard HTML if I can't find them.
// Prompt said: "UI: Tailwind CSS + Shadcn/ui".

interface StrategySelectorProps {
    currentMode: IntelligenceMode;
    onModeChange: (mode: IntelligenceMode) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ currentMode, onModeChange }) => {
    const { isPro } = useStore();

    const modes: { id: IntelligenceMode; label: string; pro?: boolean }[] = [
        { id: 'SNIPER', label: 'Modo Sniper (Gratuito)' },
        { id: 'DELTA', label: 'Sistema Delta (AI)', pro: true },
        { id: 'MATRIX', label: 'Matriz de Fechamento', pro: true },
        { id: 'EXCLUSION', label: 'Modo Exclusão', pro: true },
    ];

    return (
        <div className="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
            <h3 className="text-emerald-400 font-bold text-lg">Estratégia de Inteligência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        disabled={mode.pro && !isPro}
                        className={`
              relative p-4 rounded-md border text-left transition-all
              ${currentMode === mode.id
                                ? 'bg-slate-800 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'}
              ${mode.pro && !isPro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <div className="flex justify-between items-center">
                            <span className={`font-semibold ${currentMode === mode.id ? 'text-white' : 'text-slate-400'}`}>
                                {mode.label}
                            </span>
                            {mode.pro && (
                                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold">
                                    PRO
                                </span>
                            )}
                        </div>
                        {currentMode === mode.id && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
