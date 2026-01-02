import { useState, useMemo } from 'react';
import { LotteryBall } from '../components/LotteryBall';
import { Calendar, TrendingUp, ArrowRight, Wallet, PiggyBank, Trophy, PlusCircle, Sparkles, AlertCircle } from 'lucide-react';
import megaSenaData from '../data/megasena.json';
import type { TabId } from '../layouts/MainLayout';
import { useUserStore } from '../store/userStore';
import { calculateBetPrice, formatPrice } from '../lib/priceCalculator';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LOTTERY_CONFIGS, getLotteryPrice } from '../config/lotteries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import type { LotteryType } from '../types/domain';

// Helper to get latest results
const getLatestResults = () => {
    // Check if imported array
    if (Array.isArray(megaSenaData) && megaSenaData.length > 0) {
        return megaSenaData.slice(0, 3); // Top 3
    }
    return [];
};

interface DashboardProps {
    onNavigate: (tab: TabId) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
    const latestResults = getLatestResults();
    const { user } = useUserStore();
    const [selectedLottery, setSelectedLottery] = useState<LotteryType>('megasena');

    const config = LOTTERY_CONFIGS[selectedLottery];
    const colorName = config.primaryColor.split('-')[0];

    // Mock Next Draw Data (In a real app, this would come from an API based on selectedLottery)
    // Calculate Next Draw based on latest data
    const lastResult = Array.isArray(megaSenaData) && megaSenaData.length > 0 ? megaSenaData[0] : null;
    const nextDraw = useMemo(() => {
        if (selectedLottery === 'megasena' && lastResult) {
            // Parse date "DD/MM/YYYY" to Date object
            const parts = lastResult.data.split('/');
            const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            // Add 3 days (approx for next draw)
            date.setDate(date.getDate() + 3);

            return {
                date: date.toLocaleDateString('pt-BR'),
                prize: "R$ 58.000.000", // Estimation
                contest: (lastResult.concurso + 1).toString()
            };
        }

        // Default mocks for others
        return {
            date: "31/12/2025",
            prize: selectedLottery === 'lotofacil' ? "R$ 5.000.000" :
                selectedLottery === 'quina' ? "R$ 12.000.000" : "R$ 1.500.000",
            contest: "2670"
        };
    }, [selectedLottery, lastResult]);

    // Calculate financials for the selected lottery
    const savedGames = user?.savedGames.filter(g => {
        // Simple heuristic to filter games by length since we don't store lottery type yet
        // Ideally we should add 'lotteryType' to the Game interface
        return g.numbers.length >= config.minNumbers && g.numbers.length <= config.maxNumbers;
    }) || [];

    const totalInvestment = savedGames.reduce((acc, game) => {
        return acc + getLotteryPrice(selectedLottery, game.numbers.length);
    }, 0);

    const potentialReturn = nextDraw.prize;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Olá, {user?.email?.split('@')[0] || 'Apostador'}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Prepare-se para o próximo sorteio da {config.name}.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="megasena" value={selectedLottery} onValueChange={(val) => setSelectedLottery(val as LotteryType)} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-slate-900/50 border border-slate-800 p-1 mb-6">
                    {Object.values(LOTTERY_CONFIGS).map((lott) => (
                        <TabsTrigger
                            key={lott.slug}
                            value={lott.slug}
                            className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400"
                        >
                            {lott.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedLottery} className="space-y-6 mt-0">
                    {/* Hero Section - Urgency & Action */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 shadow-2xl group">
                        {/* Background Effects */}
                        <div className={`absolute top-0 right-0 w-96 h-96 bg-${colorName}-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-${colorName}-600/20 transition-all duration-1000`}></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-6 max-w-xl text-center md:text-left">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                                        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">
                                            Próximo Sorteio: {nextDraw.date}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-lg">
                                        {nextDraw.prize}
                                        <span className="text-lg md:text-xl font-medium text-slate-400 block mt-2 tracking-normal">
                                            Estimativa de prêmio • Concurso {nextDraw.contest}
                                        </span>
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-lg leading-relaxed">
                                    A inteligência artificial LotoMind já processou os padrões.
                                    <br className="hidden md:block" /> Sua chance de mudar de vida começa agora.
                                </p>

                                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Button
                                        onClick={() => onNavigate('generator')}
                                        className={`h-14 px-8 bg-${colorName}-600 hover:bg-${colorName}-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(var(--color-${colorName}-600),0.4)] hover:shadow-[0_0_30px_rgba(var(--color-${colorName}-600),0.6)] transition-all transform hover:-translate-y-1`}
                                    >
                                        Criar Jogo Agora <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => onNavigate('matrices')}
                                        className="h-14 px-8 border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-lg rounded-xl"
                                    >
                                        Ver Matrizes
                                    </Button>
                                </div>
                            </div>

                            {/* Decorative 3D Elements */}
                            <div className="relative w-full max-w-sm h-64 md:h-80 flex items-center justify-center perspective-1000">
                                <div className={`absolute w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-${colorName}-400 to-${colorName}-700 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.4)] animate-float z-20 flex items-center justify-center`}>
                                    <span className="text-4xl font-bold text-white drop-shadow-md">?</span>
                                </div>
                                <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full shadow-2xl animate-float-delayed z-10 -translate-x-20 translate-y-10 flex items-center justify-center border border-slate-600">
                                    <span className="text-2xl font-bold text-slate-400">?</span>
                                </div>
                                <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-full shadow-xl animate-float-slow z-0 translate-x-20 -translate-y-10 flex items-center justify-center border border-slate-700">
                                    <span className="text-xl font-bold text-slate-500">?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-8 -mt-8"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-slate-400 text-sm font-medium flex items-center gap-2 uppercase tracking-wider">
                                    <Wallet className="w-4 h-4 text-slate-500" />
                                    Investimento Total ({config.name})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">
                                    {totalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                                <p className="text-slate-500 text-xs mt-1">
                                    Baseado em {savedGames.length} jogos salvos
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-slate-400 text-sm font-medium flex items-center gap-2 uppercase tracking-wider">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    Retorno Potencial
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-400">
                                    {potentialReturn}
                                </div>
                                <p className="text-slate-500 text-xs mt-1">
                                    Estimativa se acertar o prêmio principal
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Empty State / CTA for Saved Games */}
                    {savedGames.length === 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-8 text-center animate-in fade-in duration-1000">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Nenhum jogo salvo para {config.name}
                            </h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-6">
                                Você ainda não criou nenhuma aposta para este concurso.
                                Use nossa IA para gerar jogos com alta probabilidade matemática.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => onNavigate('generator')}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Criar Primeiro Jogo
                            </Button>
                        </div>
                    )}
                    {savedGames.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="text-center space-y-4">
                                <p className="text-slate-400 text-sm">
                                    Você tem <span className="text-white font-bold">{savedGames.length}</span> jogos prontos para apostar.
                                </p>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                    onClick={() => onNavigate('history')}
                                >
                                    Conferir Jogos Salvos
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Results */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" />
                            Últimos Resultados
                        </h2>
                        <button
                            onClick={() => onNavigate('results')}
                            className="text-sm text-slate-500 hover:text-emerald-400 font-medium transition-colors"
                        >
                            Ver histórico completo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {latestResults.map((result: any) => (
                            <div key={result.concurso} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:bg-slate-900">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-bold text-lg">Concurso {result.concurso}</span>
                                            {result.is_virada && (
                                                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-amber-500/20">
                                                    Virada
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-slate-500 text-sm">{result.data}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {result.dezenas.map((d: number) => (
                                        <LotteryBall key={d} number={d} size="sm" className="bg-slate-800" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Quick Actions / Empty State */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" />
                        Seus Jogos
                    </h2>

                    {savedGames.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                                <PlusCircle className="w-8 h-8 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Nenhum jogo salvo</h3>
                                <p className="text-slate-500 text-sm">
                                    Comece a gerar estratégias com IA para aumentar suas chances.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full bg-slate-800 text-emerald-400 hover:bg-slate-700"
                                onClick={() => onNavigate('generator')}
                            >
                                Criar Primeiro Jogo
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="text-center space-y-4">
                                <p className="text-slate-400 text-sm">
                                    Você tem <span className="text-white font-bold">{savedGames.length}</span> jogos prontos para apostar.
                                </p>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                    onClick={() => onNavigate('history')}
                                >
                                    Conferir Jogos Salvos
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
