import React, { useState, useMemo } from 'react';
import { useLotoMind } from '../hooks/useLotoMind';
import { LOTTERY_CONFIGS, getNumberOptions } from '../config/lotteries';
import { calculateBetPrice, formatPrice } from '../lib/priceCalculator';
import type { IntelligenceMode, LotteryType } from '../types/domain';
import { StrategySelector } from '../components/saas/StrategySelector';
import { GameCard } from '../components/saas/GameCard';
import { Zap, Download, Info } from 'lucide-react';

export const Generator: React.FC = () => {
    const [selectedLottery, setSelectedLottery] = useState<LotteryType>('megasena');
    const activeLottery = LOTTERY_CONFIGS[selectedLottery];

    const {
        generate,
        generatedGames,
        isGenerating,
        error
    } = useLotoMind({ lottery: activeLottery });

    const [mode, setMode] = useState<IntelligenceMode>('RANDOM');
    const [numbersCount, setNumbersCount] = useState(6);
    const [quantity, setQuantity] = useState(1);

    const numberOptions = getNumberOptions(selectedLottery);
    const betPrice = useMemo(() =>
        calculateBetPrice(selectedLottery, numbersCount),
        [selectedLottery, numbersCount]
    );

    const handleGenerate = () => {
        generate(mode, quantity, undefined);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-4">
                {/* Lottery Selection */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <label className="block text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                        Loteria
                    </label>
                    <select
                        value={selectedLottery}
                        onChange={(e) => {
                            const newLottery = e.target.value as LotteryType;
                            setSelectedLottery(newLottery);
                            const newOptions = getNumberOptions(newLottery);
                            setNumbersCount(newOptions[0]);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all hover:border-slate-700"
                    >
                        <option value="megasena">Mega Sena</option>
                        <option value="lotofacil">Lotofácil</option>
                        <option value="quina">Quina</option>
                        <option value="lotomania">Lotomania</option>
                        <option value="diadesorte">Dia de Sorte</option>
                    </select>
                </div>

                {/* Numbers Count Selection */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <label className="block text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                        Quantidade de Dezenas
                    </label>
                    <select
                        value={numbersCount}
                        onChange={(e) => setNumbersCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all hover:border-slate-700"
                    >
                        {numberOptions.map(num => (
                            <option key={num} value={num}>
                                {num} números
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Display */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-300 mb-3">
                                Você escolheu jogar <span className="font-mono font-bold text-slate-100">{numbersCount}</span> números.
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Custo da aposta:</span>
                                <span className="text-2xl font-mono font-bold text-slate-100">
                                    {formatPrice(betPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <StrategySelector currentMode={mode} onModeChange={setMode} />

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                    <label className="block text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                        Quantidade de Jogos
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="flex items-center justify-center w-12 h-12 bg-slate-950 rounded-lg font-mono font-bold text-slate-100 border border-slate-800">
                            {quantity}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`
                        w-full py-4 rounded-lg font-bold text-base transition-all border
                        flex items-center justify-center gap-2
                        ${isGenerating
                            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-700 hover:bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-black/20'}
                    `}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={20} className="fill-current text-white" />
                            <span>GERAR JOGOS</span>
                        </>
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="lg:col-span-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-100">
                        Jogos Gerados
                        {generatedGames.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                ({generatedGames.length})
                            </span>
                        )}
                    </h2>
                    {generatedGames.length > 0 && (
                        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-800">
                            <Download size={16} />
                            Exportar
                        </button>
                    )}
                </div>

                {generatedGames.length === 0 ? (
                    <div className="h-[500px] flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
                            <Zap size={28} className="text-slate-700" />
                        </div>
                        <h3 className="text-base font-bold text-slate-400 mb-2">Aguardando Geração</h3>
                        <p className="text-slate-600 text-sm max-w-xs text-center">
                            Configure os parâmetros e clique em "Gerar Jogos"
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Analysis Badge */}
                        <div className="p-4 bg-emerald-600/5 border border-emerald-600/10 rounded-lg flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 flex-shrink-0"></div>
                            <div className="flex-1">
                                <h4 className="text-emerald-500 font-bold text-xs mb-1 uppercase tracking-wider">Relatório da IA</h4>
                                <p className="text-slate-400 text-sm">
                                    Modo <span className="text-slate-200 font-medium">{mode}</span> aplicado.
                                    Pontuação média: <span className="text-emerald-400 font-mono font-bold">
                                        {Math.round(generatedGames.reduce((a, b) => a + b.totalScore, 0) / generatedGames.length)}/100
                                    </span>
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
