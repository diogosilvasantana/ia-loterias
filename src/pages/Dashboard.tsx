import React from 'react';
import { LotteryBall } from '../components/LotteryBall';
import { Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import megaSenaData from '../data/megasena.json';
import type { TabId } from '../layouts/MainLayout';

// Helper to get latest results
const getLatestResults = () => {
    // Check if imported array
    if (Array.isArray(megaSenaData) && megaSenaData.length > 0) {
        return megaSenaData.slice(0, 5); // Top 5
    }
    return [];
};

interface DashboardProps {
    onNavigate: (tab: TabId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const latestResults = getLatestResults();

    // Estimate next draw (mock calculation for demo)
    // Real app would fetch "Next Draw" date from API
    const nextDrawDate = "23/12/2025";
    const estimatedPrize = "R$ 60.000.000,00";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-bold border border-slate-700">
                            <Calendar size={14} />
                            <span>Próximo Sorteio: {nextDrawDate}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Mega da Virada <span className="text-emerald-400">2025</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            A inteligência artificial do LotoMind já analisou os padrões. Prepare-se para o prêmio estimado de:
                        </p>
                        <div className="text-3xl md:text-4xl font-mono font-bold text-emerald-400">
                            {estimatedPrize}
                        </div>
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={() => onNavigate('generator')}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                            >
                                Gerar Jogo Agora <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => onNavigate('matrices')}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all"
                            >
                                Ver Matrizes
                            </button>
                        </div>
                    </div>

                    {/* Visual Eye Candy - 3D Balls */}
                    <div className="relative hidden md:block">
                        <div className="grid grid-cols-2 gap-3 transform rotate-6">
                            {[10, 23, 45, 59].map(n => (
                                <LotteryBall key={n} number={n} size="lg" className="shadow-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Results Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" />
                        Últimos Resultados
                    </h2>
                    <button
                        onClick={() => onNavigate('results')}
                        className="text-sm text-slate-500 hover:text-emerald-400 font-medium"
                    >
                        Ver todos
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestResults.map((result: any) => (
                        <div key={result.concurso} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500 font-mono text-sm">Concurso #{result.concurso}</span>
                                <span className="text-slate-400 text-xs">{result.data}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center mb-4">
                                {result.dezenas.map((d: number) => (
                                    <LotteryBall key={d} number={d} size="sm" />
                                ))}
                            </div>
                            {result.is_virada && (
                                <div className="text-center">
                                    <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Mega da Virada</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
