import React, { useState } from 'react';
import { useLotoMind } from '../hooks/useLotoMind';
import { LOTTERY_CONFIGS } from '../config/lotteries';
import type { IntelligenceMode } from '../types/domain';
import { StrategySelector } from '../components/saas/StrategySelector';
import { GameCard } from '../components/saas/GameCard';
import { Zap, Download } from 'lucide-react';

export const Generator: React.FC = () => {
    // Default to MegaSena for now (or make it selectable via props/context later if moving LotterySelector here)
    const activeLottery = LOTTERY_CONFIGS['megasena'];

    const {
        generate,
        generatedGames,
        isGenerating,
        error
    } = useLotoMind({ lottery: activeLottery });

    const [mode, setMode] = useState<IntelligenceMode>('RANDOM');
    const [quantity, setQuantity] = useState(1);

    const handleGenerate = () => {
        // Simple call, passing undefined for matrixConfig for now as we are not in Matrix tab
        generate(mode, quantity, undefined);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Loteria Ativa</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-600/20">MS</div>
                        <div>
                            <div className="font-bold text-white">Mega Sena</div>
                            <div className="text-xs text-emerald-400 font-medium">Acumulada: R$ 55.000.000</div>
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
                            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                        />
                        <span className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-lg font-bold text-white border border-slate-700">
                            {quantity}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                        items-center justify-center flex gap-2 relative overflow-hidden
                        ${isGenerating
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-500/25 transform hover:-translate-y-0.5'}
                    `}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Processando IA...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={20} className="fill-current" />
                            <span>GERAR JOGOS</span>
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="lg:col-span-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Jogos Gerados
                        {generatedGames.length > 0 && <span className="text-sm font-normal text-slate-500 ml-2">({generatedGames.length})</span>}
                    </h2>
                    {generatedGames.length > 0 && (
                        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                            <Download size={16} />
                            Exportar
                        </button>
                    )}
                </div>

                {generatedGames.length === 0 ? (
                    <div className="h-[500px] flex flex-col items-center justify-center bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-800 text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-4 ring-1 ring-slate-800">
                            <Zap size={32} className="text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-300 mb-1">IA Aguardando</h3>
                        <p className="text-slate-500 max-w-xs">
                            Selecione uma estratégia e a quantidade de jogos para iniciar o motor de inteligência.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Analysis Badge */}
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                            <div>
                                <h4 className="text-emerald-400 font-bold text-sm mb-1 uppercase tracking-wide">Relatório da IA</h4>
                                <p className="text-slate-400 text-sm">
                                    O motor utilizou <strong>{mode}</strong> para criar estes palpites com base em padrões de <span className="text-white">alta probabilidade</span>.
                                    Média de pontuação: <span className="text-emerald-400 font-bold">{Math.round(generatedGames.reduce((a, b) => a + b.totalScore, 0) / generatedGames.length)}/100</span>.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {generatedGames.map((game, idx) => (
                                <GameCard key={game.id || idx} game={game} index={idx} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
