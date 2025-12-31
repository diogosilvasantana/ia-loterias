import React from 'react';
import type { Game } from '../../types/domain';

interface GameCardProps {
    game: Game;
    index: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, index }) => {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm font-mono">#{String(index + 1).padStart(2, '0')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${game.totalScore > 90
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        }`}>
                        {game.category}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-white">{game.totalScore}</span>
                    <span className="text-xs text-slate-500 uppercase">Score</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {game.numbers.map((n) => (
                    <div key={n} className="
            w-10 h-10 rounded-full bg-slate-900 border border-slate-700 
            flex items-center justify-center text-white font-bold
            shadow-inner group-hover:border-emerald-500/30 transition-colors
          ">
                        {String(n).padStart(2, '0')}
                    </div>
                ))}
            </div>

            <div className="space-y-1">
                {game.strategiesResults.map((res, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                        <span>{res.name}</span>
                        <span className={res.isValid ? 'text-emerald-500' : 'text-amber-500'}>
                            {res.isValid ? '✓ Aprovado' : '⚠ ' + (res.reason || 'Alerta')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
