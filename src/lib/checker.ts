import megaSenaData from '../data/megasena.json';
import { Badge } from '../components/ui/badge';
import React from 'react';
import { Trophy, Medal, Award, CheckCircle2 } from 'lucide-react';

export interface CheckResult {
    hits: number;
    matchedNumbers: number[];
    contest: number;
    date: string;
}

export interface BadgeConfig {
    label: string;
    color: string;
    icon: React.ReactNode;
}

// Ensure data is typed
const results = megaSenaData as Array<{
    concurso: number;
    data: string;
    dezenas: number[];
    is_virada: boolean;
}>;

export const checkGameAgainstAllResults = (gameNumbers: number[]): CheckResult | null => {
    let bestMatch: CheckResult | null = null;

    for (const result of results) {
        const matches = gameNumbers.filter(num => result.dezenas.includes(num));
        const hits = matches.length;

        if (hits >= 4) { // Only care about Quadra (4) or higher
            // If we find a Sena (6), return immediately as it's the best possible
            if (hits === 6) {
                return {
                    hits,
                    matchedNumbers: matches,
                    contest: result.concurso,
                    date: result.data
                };
            }

            // Keep track of the best match found (e.g. Quina > Quadra)
            if (!bestMatch || hits > bestMatch.hits) {
                bestMatch = {
                    hits,
                    matchedNumbers: matches,
                    contest: result.concurso,
                    date: result.data
                };
            }
        }
    }

    return bestMatch;
};

export const getBadgeForHits = (hits: number): BadgeConfig | null => {
    if (hits === 6) {
        return {
            label: "Sena (6 Acertos)",
            color: "text-amber-400 bg-amber-950/30 border-amber-500/50",
            icon: React.createElement(Trophy, { className: "w-3 h-3 text-amber-500" })
        };
    }
    if (hits === 5) {
        return {
            label: "Quina (5 Acertos)",
            color: "text-slate-300 bg-slate-800 border-slate-600",
            icon: React.createElement(Medal, { className: "w-3 h-3 text-slate-400" })
        };
    }
    if (hits === 4) {
        return {
            label: "Quadra (4 Acertos)",
            color: "text-orange-400 bg-orange-950/30 border-orange-500/50",
            icon: React.createElement(Award, { className: "w-3 h-3 text-orange-500" })
        };
    }
    return null;
};
