import { AnimatePresence, motion } from "framer-motion";
import type { Game, LotteryConfig } from "../types";
import { LotteryBall } from "./LotteryBall";
import { Button } from "./ui/button";
import { Trash2, History } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface GameListProps {
    games: Game[];
    onClear: () => void;
    onRemove: (id: string) => void;
    config: LotteryConfig;
}

export const GameList = ({ games, onClear, onRemove, config }: GameListProps) => {
    if (games.length === 0) return null;

    const colorName = config.primaryColor.split('-')[0];

    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-slate-300 font-semibold flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Histórico {config.name}
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                        {games.length}
                    </Badge>
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-950/30 h-8 text-xs"
                >
                    Limpar Tudo
                </Button>
            </div>

            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3 pb-8">
                    <AnimatePresence mode="popLayout">
                        {games.map((game) => (
                            <motion.div
                                key={game.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 group relative overflow-hidden"
                            >
                                {/* Decorative glow based on primary color */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${colorName}-500 to-${colorName}-700`} />

                                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 flex-1">
                                    {game.numbers.map((num) => (
                                        <LotteryBall
                                            key={num}
                                            number={num}
                                            size={config.pickedNumbers > 10 ? "sm" : "md"} // Smaller balls for Lotofacil/Lotomania
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 sm:border-l sm:border-slate-800 sm:pl-4 flex-col sm:items-end">
                                    <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                                        {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {game.explanation && (
                                        <div className="flex flex-col items-end gap-1">
                                            {/* Strategy Badge */}
                                            {game.strategy === 'trend' && (
                                                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50 flex items-center gap-1">
                                                    🔥 TENDÊNCIA
                                                </span>
                                            )}
                                            {game.strategy === 'surprise' && (
                                                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/50 flex items-center gap-1">
                                                    🦓 SURPRESA
                                                </span>
                                            )}
                                            {/* Explanation */}
                                            <span className={`text-[10px] text-${colorName}-400 font-medium bg-${colorName}-950/30 px-2 py-0.5 rounded border border-${colorName}-900/50 text-right`}>
                                                {game.explanation}
                                            </span>
                                            {game.confidence && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${game.confidence >= 90 ? 'text-amber-400 bg-amber-950/30 border-amber-900/50' :
                                                    game.confidence >= 80 ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50' :
                                                        'text-slate-400 bg-slate-800/50'
                                                    } border`}>
                                                    Confiança: {game.confidence}%
                                                </span>
                                            )}
                                        </div>
                                    )}
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
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};
