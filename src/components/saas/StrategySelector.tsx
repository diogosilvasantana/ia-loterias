import React from 'react';
import type { IntelligenceMode } from '../../types/domain';
import { useAuth } from '../../hooks/useAuth';

interface StrategySelectorProps {
    currentMode: IntelligenceMode;
    onModeChange: (mode: IntelligenceMode) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ currentMode, onModeChange }) => {
    const { isPro } = useAuth();

    const modes: { id: IntelligenceMode; label: string; description: string; pro?: boolean }[] = [
        { id: 'RANDOM', label: 'Aleatório Inteligente', description: 'Filtros básicos (Soma, Par/Ímpar)' },
        { id: 'STATISTICAL', label: 'Estatístico (Heatmaps)', description: 'Baseado em frequência e atrasos', pro: true },
        { id: 'MATRIX', label: 'Fechamentos (Matrizes)', description: 'Garantia matemática de acertos', pro: true },
        { id: 'DELTA', label: 'Sistema Delta', description: 'Análise de diferenças', pro: true },
    ];

    return (
        <div className="flex flex-col gap-4 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <h3 className="text-emerald-400 font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                Estratégia de Inteligência
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => !(!isPro && mode.pro) && onModeChange(mode.id)} // Prevent click if locked
                        className={`
              relative p-4 rounded-lg border text-left transition-all group
              ${currentMode === mode.id
                                ? 'bg-slate-800/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}
              ${mode.pro && !isPro ? 'opacity-60 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}
            `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold text-base ${currentMode === mode.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {mode.label}
                            </span>
                            {mode.pro && (
                                <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    PRO
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            {mode.description}
                        </p>

                        {currentMode === mode.id && (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
