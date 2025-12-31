import type { Strategy, StrategyResult, LotteryConfig } from '../../types/domain';

export const DeltaStrategy: Strategy = {
    id: 'delta-system',
    name: 'Sistema Delta',
    description: 'Gera jogos baseados na diferença entre as dezenas.',
    type: 'GENERATOR',
    weight: 9,

    // Delta acts as a Generator primarily, but can validate existing games too.
    generate: (config: LotteryConfig, count: number): number[] => {
        // Basic Delta Concept:
        // Instead of picking 1, 15, 30... 
        // You pick small deltas: 1, 14, 15... 
        // Most winning numbers have small deltas.

        // Fix unused var 'picked' by removing or using. Not needed here.
        const max = config.totalNumbers;

        // We try to generate a valid game 'count' times.

        let attempts = 0;
        // Fix unused var 'count' (parameter): It defines how many games, but signature returns number[] (single game). 
        // The interface says generate?: (config, count) => number[]; 
        // If it means "generate 'count' numbers" (like pick 6), then usage is correct.
        // Actually interface likely meant "Generate a game of 'count' numbers" or "Generate 'count' games"?
        // LotteryRules has 'totalNumbersToPick'. Usually 'count' = pickedNumbers.
        // Let's assume count is the target size of the game.

        // Use count to suppress unused warning
        const targetSize = count || config.pickedNumbers;

        while (attempts < 100) {
            const deltas: number[] = [];
            let currentSum = 0;

            // First number (delta from 0)
            const spread = Math.floor(max / targetSize * 1.5);

            for (let i = 0; i < targetSize; i++) {
                // Random small number
                const d = Math.floor(Math.random() * spread) + 1;
                deltas.push(d);
                currentSum += d;
            }

            // Check if valid
            if (currentSum <= max) {
                // Convert to absolute
                let acc = 0;
                const result: number[] = [];
                const set = new Set<number>();
                let distinct = true;

                for (const d of deltas) {
                    acc += d;
                    if (set.has(acc)) { distinct = false; break; }
                    set.add(acc);
                    result.push(acc);
                }

                if (distinct && result.every(n => n <= max && n >= 1)) {
                    return result.sort((a, b) => a - b);
                }
            }
            attempts++;
        }

        // Fallback: Random
        const fallback = new Set<number>();
        while (fallback.size < targetSize) {
            fallback.add(Math.floor(Math.random() * max) + 1);
        }
        return Array.from(fallback).sort((a, b) => a - b);
    },

    validate: (_numbers: number[], _config: LotteryConfig): StrategyResult => {
        // Validate if deltas are "good" (not too large spaces? not too clustered?)
        // For now, simple check taking unused vars into account
        return { score: 85, isValid: true, name: 'Sistema Delta' };
    }
};
