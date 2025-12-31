import React, { useState, useMemo } from 'react';
import type { LotteryType } from '../types/domain';
import { LOTTERY_CONFIGS, getNumberOptions } from '../config/lotteries';
import { calculateSyndicatePrice, calculateSharePrice, formatPrice } from '../lib/priceCalculator';
import { PriceDisplay } from '../components/PriceDisplay';
import { Users, Calculator, TrendingUp } from 'lucide-react';

export const Syndicate: React.FC = () => {
    const [selectedLottery, setSelectedLottery] = useState<LotteryType>('megasena');
    const [numbersCount, setNumbersCount] = useState(6);
    const [gamesCount, setGamesCount] = useState(1);
    const [sharesCount, setSharesCount] = useState(10);

    const config = LOTTERY_CONFIGS[selectedLottery];
    const numberOptions = getNumberOptions(selectedLottery);

    const totalPrice = useMemo(() =>
        calculateSyndicatePrice(selectedLottery, numbersCount, gamesCount),
        [selectedLottery, numbersCount, gamesCount]
    );

    const pricePerShare = useMemo(() =>
        calculateSharePrice(totalPrice, sharesCount),
        [totalPrice, sharesCount]
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-lg bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Simulador de Bolões</h1>
                    <p className="text-sm text-slate-400">Calcule o custo e divida entre os participantes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lottery Selection */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                            <option value="megasena">Mega Sena</option>
                            <option value="lotofacil">Lotofácil</option>
                            <option value="quina">Quina</option>
                            <option value="lotomania">Lotomania</option>
                            <option value="diadesorte">Dia de Sorte</option>
                        </select>
                    </div>

                    {/* Numbers Count */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            Quantidade de Dezenas
                        </label>
                        <select
                            value={numbersCount}
                            onChange={(e) => setNumbersCount(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                            {numberOptions.map(num => (
                                <option key={num} value={num}>
                                    {num} números - {formatPrice(config.priceTable[num])}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Games Count */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            Quantidade de Jogos (Cartões)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={gamesCount}
                            onChange={(e) => setGamesCount(Math.max(1, Number(e.target.value)))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Cada jogo é um volante independente
                        </p>
                    </div>

                    {/* Shares Count */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <label className="block text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
                            Quantidade de Cotas
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="1000"
                            value={sharesCount}
                            onChange={(e) => setSharesCount(Math.max(2, Number(e.target.value)))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Número de participantes que dividirão o custo
                        </p>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-4">
                    {/* Total Cost */}
                    <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800/30 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm uppercase tracking-wider text-emerald-400 font-medium">
                                Custo Total do Bolão
                            </span>
                        </div>
                        <PriceDisplay amount={totalPrice} size="xl" highlight />
                        <div className="mt-4 pt-4 border-t border-emerald-800/30 space-y-2 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Preço por jogo:</span>
                                <span className="font-mono">{formatPrice(config.priceTable[numbersCount])}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Total de jogos:</span>
                                <span className="font-mono">{gamesCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Per Share */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            <span className="text-sm uppercase tracking-wider text-slate-400 font-medium">
                                Valor por Cota
                            </span>
                        </div>
                        <PriceDisplay amount={pricePerShare} size="lg" />
                        <p className="mt-4 text-xs text-slate-500">
                            Cada participante paga {formatPrice(pricePerShare)} para participar do bolão
                        </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Resumo</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Loteria:</span>
                                <span className="text-slate-100 font-medium">{config.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Dezenas:</span>
                                <span className="text-slate-100 font-mono">{numbersCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Jogos:</span>
                                <span className="text-slate-100 font-mono">{gamesCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Participantes:</span>
                                <span className="text-slate-100 font-mono">{sharesCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
