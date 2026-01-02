import { AnimatePresence, motion } from "framer-motion";
import type { Game, LotteryType } from "../types/domain";
import { LOTTERY_CONFIGS } from "../config/lotteries";
import { LotteryBall } from "./LotteryBall";
import { Button } from "./ui/button";
import { Trash2, History, CheckCircle2, Download, AlertCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { checkGameAgainstAllResults, getBadgeForHits, type CheckResult } from "../lib/checker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GameListProps {
    games: Game[];
    onClear: () => void;
    onRemove: (id: string) => void;
}

export const GameList = ({ games, onClear, onRemove }: GameListProps) => {
    const [selectedLottery, setSelectedLottery] = useState<LotteryType>('megasena');
    const [checkResults, setCheckResults] = useState<Record<string, CheckResult | null>>({});
    const [isChecking, setIsChecking] = useState(false);

    // Filter games for the selected lottery
    const filteredGames = games.filter(g => (g.lotteryType || 'megasena') === selectedLottery);

    const config = LOTTERY_CONFIGS[selectedLottery];
    const colorName = config.primaryColor.split('-')[0];

    const handleCheckGames = async () => {
        setIsChecking(true);
        // Simulate a small delay for UX purpose
        await new Promise(resolve => setTimeout(resolve, 800));

        const results: Record<string, CheckResult | null> = {};
        filteredGames.forEach(game => {
            results[game.id] = checkGameAgainstAllResults(game.numbers);
        });

        setCheckResults(prev => ({ ...prev, ...results }));
        setIsChecking(false);
    };

    const handleExport = () => {
        const content = filteredGames.map(g => g.numbers.map(n => n.toString().padStart(2, '0')).join(',')).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jogos_${config.slug}_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-slate-400" />
                Meus Jogos Salvos
            </h2>

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

                <TabsContent value={selectedLottery} className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-2 gap-4">
                        <h3 className="text-slate-300 font-semibold flex items-center gap-2">
                            Histórico {config.name}
                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                                {filteredGames.length}
                            </Badge>
                        </h3>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCheckGames}
                                disabled={isChecking || filteredGames.length === 0}
                                className="flex-1 sm:flex-none border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/30 hover:text-emerald-300"
                            >
                                {isChecking ? "Conferindo..." : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Conferir Resultados
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleExport}
                                disabled={filteredGames.length === 0}
                                className="text-slate-400 hover:text-slate-200"
                                title="Exportar para TXT"
                            >
                                <Download className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClear}
                                disabled={games.length === 0} // Clear all clears EVERYTHING or just current tab? Usually expected to be everything or current. Let's keep it consistent with "History" clear usually means "Clear this list". But for safety, maybe just pass onClear which likely clears ALL.
                                className="text-slate-500 hover:text-red-400 hover:bg-red-950/30 h-8 text-xs"
                            >
                                Limpar Tudo
                            </Button>
                        </div>
                    </div>

                    {filteredGames.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
                            <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History className="w-6 h-6 text-slate-600" />
                            </div>
                            <h3 className="text-slate-400 font-medium mb-1">Nenhum jogo salvo para {config.name}</h3>
                            <p className="text-slate-600 text-sm">Gere novos jogos usando a inteligência artificial.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-3 pb-8">
                                <AnimatePresence mode="popLayout">
                                    {filteredGames.map((game, index) => {
                                        const result = checkResults[game.id];
                                        const badge = result && result.hits >= 4 ? getBadgeForHits(result.hits) : null;

                                        return (
                                            <motion.div
                                                key={game.id}
                                                layout
                                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                    transition: { delay: index * 0.05 }
                                                }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className={`bg - slate - 900 / 80 border ${badge ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-slate-800'} p - 4 rounded - xl flex flex - col sm: flex - row items - center justify - between gap - 4 group relative overflow - hidden`}
                                            >
                                                {/* Decorative glow based on primary color */}
                                                <div className={`absolute left - 0 top - 0 bottom - 0 w - 1 bg - gradient - to - b from - ${colorName} -500 to - ${colorName} -700`} />

                                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 flex-1">
                                                    {game.numbers.map((num) => (
                                                        <LotteryBall
                                                            key={num}
                                                            number={num}
                                                            size={config.pickedNumbers > 10 ? "sm" : "md"}
                                                            className={result?.matchedNumbers?.includes(num) ? "ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : ""}
                                                        />
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2 sm:border-l sm:border-slate-800 sm:pl-4 flex-col sm:items-end min-w-[100px]">
                                                    {badge && (
                                                        <div className={`text - xs font - bold px - 2 py - 1 rounded bg - gradient - to - r flex items - center gap - 1 mb - 1 ${badge.color} `}>
                                                            <span>{badge.icon}</span> {badge.label}
                                                        </div>
                                                    )}

                                                    <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                                                        {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>

                                                    <div className="flex flex-col items-end gap-1">
                                                        {/* Strategy Badge */}
                                                        {game.category === 'SNIPER' && (
                                                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50 flex items-center gap-1">
                                                                🔥 TENDÊNCIA
                                                            </span>
                                                        )}
                                                        {game.category === 'RANDOM' && (
                                                            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/50 flex items-center gap-1">
                                                                🦓 SURPRESA
                                                            </span>
                                                        )}

                                                        {/* Details */}
                                                        {game.strategiesResults?.[0]?.name && (
                                                            <span className={`text - [10px] text - ${colorName} -400 font - medium bg - ${colorName} -950 / 30 px - 2 py - 0.5 rounded border border - ${colorName} -900 / 50 text - right`}>
                                                                {game.strategiesResults[0].name}
                                                            </span>
                                                        )}

                                                        {game.totalScore && (
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${game.totalScore >= 90 ? 'text-amber-400 bg-amber-950/30 border-amber-900/50' :
                                                                game.totalScore >= 80 ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50' :
                                                                    'text-slate-400 bg-slate-800/50'
                                                                } border`}>
                                                                Score: {game.totalScore}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onRemove(game.id)}
                                                        className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-950/50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

