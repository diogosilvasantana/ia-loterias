import type { LotteryStats } from "../types";
import { LotteryBall } from "./LotteryBall";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Flame } from "lucide-react";

interface StatsViewProps {
    stats: LotteryStats | null;
}

export const StatsView = ({ stats }: StatsViewProps) => {
    if (!stats) return null;

    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8 w-full max-w-2xl mx-auto overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-amber-500 text-lg uppercase tracking-wider font-bold">
                    <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
                    Números Quentes
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <p className="text-slate-400 text-sm mb-4">
                    Baseado na frequência histórica dos sorteios analisados.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {stats.hotNumbers.map((num) => (
                        <div key={num} className="group relative">
                            <LotteryBall
                                number={num}
                                size="sm"
                            />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {stats.frequencyMap[num]}x
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
