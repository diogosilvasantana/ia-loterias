import React, { useState } from 'react';
import { useLotoMind } from '../../hooks/useLotoMind';
import { LOTTERY_CONFIGS } from '../../config/lotteries'; // Use existing config
import type { IntelligenceMode } from '../../types/domain';
import { StrategySelector } from './StrategySelector';
import { GameCard } from './GameCard';
import { useStore } from '../../store';

export const SaasDashboard: React.FC = () => {
    // Hardcoded Lottery Selection for now, or pass via props. 
    // Let's assume MegaSena as default or selectable.
    // Ideally we use the existing LotterySelector from previous conversations if available.

    // For this SaaS demo, we focus on Mega Sena.
    const activeLottery = LOTTERY_CONFIGS['megasena'];
    // Adapt to LotteryConfig of engine if needed, but we aligned types.

    const {
        generate,
        generatedGames,
        isGenerating,
        error,
        credits,
        isPro
    } = useLotoMind({ lottery: activeLottery });

    const { addCredits, setProStatus } = useStore();

    const [mode, setMode] = useState<IntelligenceMode>('RANDOM');
    const [quantity, setQuantity] = useState(1);

    const handleGenerate = () => {
        generate(mode, quantity, mode === 'MATRIX' ? {
            id: 'matrix-1',
            name: 'Fechamento Quadra',
            totalNumbers: 10,
            guarantee: 4,
            condition: 6
        } : undefined);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white">
                            L
                        </div>
                        <h1 className="font-bold text-xl tracking-tight text-white">
                            LotoMind <span className="text-emerald-400 font-light">AI</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Dev Controls */}
                        <div className="hidden md:flex gap-2 mr-4 border-r border-slate-800 pr-4">
                            <button onClick={() => addCredits(5)} className="text-xs text-slate-500 hover:text-white">
                                +5 Créditos
                            </button>
                            <button onClick={() => setProStatus(!isPro)} className="text-xs text-slate-500 hover:text-white">
                                {isPro ? 'Desativar Pro' : 'Ativar Pro'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-emerald-400">{credits} CRÉDITOS</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar / Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Loteria Ativa</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">MS</div>
                                <div>
                                    <div className="font-bold text-white">Mega Sena</div>
                                    <div className="text-xs text-emerald-400">R$ 55.000.000,00</div>
                                </div>
                            </div>
                        </div>

                        <StrategySelector currentMode={mode} onModeChange={setMode} />

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <label className="block text-sm font-medium text-slate-400 mb-4">Quantidade de Jogos</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`
                w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all
                items-center justify-center flex gap-2
                ${isGenerating
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-500/20 transform hover:-translate-y-0.5'}
              `}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Processando IA...
                                </>
                            ) : (
                                'GERAR JOGOS'
                            )}
                        </button>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Jogos Gerados</h2>
                            {generatedGames.length > 0 && (
                                <button className="text-sm text-slate-400 hover:text-white underline">
                                    Exportar Excel
                                </button>
                            )}
                        </div>

                        {generatedGames.length === 0 ? (
                            <div className="h-96 flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                                    <span className="text-2xl">🎲</span>
                                </div>
                                <p className="text-slate-500">Selecione uma estratégia e gere seus jogos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {generatedGames.map((game, idx) => (
                                    <GameCard key={idx} game={game} index={idx} />
                                ))}
                            </div>
                        )}

                        {generatedGames.length > 0 && (
                            <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
                                <h3 className="font-bold text-white mb-2">Análise da IA</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    O Motor Híbrido analisou <strong>{mode}</strong> e identificou padrões de alta probabilidade nos jogos acima.
                                    A pontuação média foi de <span className="text-emerald-400">{Math.round(generatedGames.reduce((a, b) => a + b.totalScore, 0) / generatedGames.length)}/100</span>.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};
