import type {
    GameScore,
    IntelligenceMode,
    MatrixConfig,
    Strategy
} from '../types/engine';
import type { LotteryConfig } from '../types';
import { ALL_STRATEGIES } from './strategies';
import { WheelGenerator } from './matrix/WheelGenerator';

interface EngineRequest {
    lottery: LotteryConfig;
    mode: IntelligenceMode;
    quantity: number; // How many games to return
    matrixConfig?: MatrixConfig;
    excludedNumbers?: number[];
    fixedNumbers?: number[];
}

export class CoreEngine {
    private strategies: Strategy[];

    constructor(strategies: Strategy[] = ALL_STRATEGIES) {
        this.strategies = strategies;
    }

    /**
     * Main entry point to generate games
     */
    public generate(request: EngineRequest): GameScore[] {
        const { lottery, mode, quantity } = request;

        switch (mode) {
            case 'SNIPER':
                return this.generateSniper(lottery, quantity, request.fixedNumbers, request.excludedNumbers);
            case 'DELTA':
                return this.generateDelta(lottery, quantity);
            case 'MATRIX':
                if (!request.matrixConfig) throw new Error("Matrix Config required for Matrix mode");
                return this.generateMatrix(lottery, request.matrixConfig);
            default:
                return this.generateSniper(lottery, quantity);
        }
    }

    /**
     * Sniper Mode: Generates high-scoring random games
     */
    private generateSniper(
        config: LotteryConfig,
        count: number,
        fixed: number[] = [],
        excluded: number[] = []
    ): GameScore[] {
        const results: GameScore[] = [];
        let attempts = 0;
        const MAX_ATTEMPTS = count * 200; // Limit to avoid infinite loops

        while (results.length < count && attempts < MAX_ATTEMPTS) {
            attempts++;

            // 1. Generate Random Game
            const numbers = this.generateRandomNumbers(config, fixed, excluded);

            // 2. Score it
            const score = this.scoreGame(numbers, config);

            // 3. Acceptance Criteria (e.g. Score > 70)
            if (score.totalScore > 75) {
                results.push(score);
            }
        }

        // Sort by score
        return results.sort((a, b) => b.totalScore - a.totalScore);
    }

    /**
     * Delta Mode: Uses Delta Strategy purely
     */
    private generateDelta(config: LotteryConfig, count: number): GameScore[] {
        const deltaStrat = this.strategies.find(s => s.id === 'delta-system');
        if (!deltaStrat || !deltaStrat.generate) {
            throw new Error("Delta Strategy not found");
        }

        const results: GameScore[] = [];
        for (let i = 0; i < count; i++) {
            const numbers = deltaStrat.generate(config, 1);
            results.push(this.scoreGame(numbers, config));
        }
        return results.sort((a, b) => b.totalScore - a.totalScore);
    }

    /**
     * Matrix Mode: Picks N best numbers, then rounds them
     */
    private generateMatrix(config: LotteryConfig, matrix: MatrixConfig): GameScore[] {
        // 1. Pick 'totalNumbers' (e.g. 10) best candidates
        const candidates = this.pickBestCandidates(config, matrix.totalNumbers);

        // 2. Wheel them
        const wheels = WheelGenerator.generate(candidates, config.pickedNumbers, matrix.guarantee);

        // 3. Score all generated games
        return wheels.map(w => this.scoreGame(w, config))
            .sort((a, b) => b.totalScore - a.totalScore);
    }

    /**
     * Scores a single game against all active strategies
     */
    public scoreGame(numbers: number[], config: LotteryConfig): GameScore {
        let totalWeight = 0;
        let weightedSum = 0;
        const stratResults = [];

        for (const strat of this.strategies) {
            if (strat.type === 'FILTER' && strat.validate) {
                const res = strat.validate(numbers, config);
                stratResults.push(res);

                weightedSum += res.score * strat.weight;
                totalWeight += strat.weight;
            }
        }

        const finalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

        return {
            numbers,
            totalScore: finalScore,
            strategiesResults: stratResults,
            category: finalScore > 90 ? 'SNIPER' : 'BALANCED'
        };
    }

    /**
     * Helper: Generate random numbers respecting fixed/excluded
     */
    private generateRandomNumbers(
        config: LotteryConfig,
        fixed: number[] = [],
        excluded: number[] = []
    ): number[] {
        const picked = new Set<number>(fixed);
        const excludeSet = new Set<number>(excluded);

        // Safety check
        if (fixed.length > config.pickedNumbers) throw new Error("Too many fixed numbers");

        while (picked.size < config.pickedNumbers) {
            const n = Math.floor(Math.random() * config.totalNumbers) + 1; // 1 to total
            // Adjust if range is 0-99 (Lotomania)
            // Usually config.totalNumbers is 60 (1-60)
            // If lotomania, min is 0. 
            // Need to handle 0-index vs 1-index based on config?
            // LOTTERY_CONFIG types usually imply 1-N.

            if (!picked.has(n) && !excludeSet.has(n)) {
                picked.add(n);
            }
        }

        return Array.from(picked).sort((a, b) => a - b);
    }

    /**
     * Helper: Pick best candidates for Matrix
     * Uses "Frequency" concept (simulated or real if Stats module exists).
     * For now, generating a larger pool of randoms and picking the ones that appear in high-scoring games?
     * Or simply picking High-Scoring small games and merging?
     * 
     * Better approach for v1: 
     * Generate many random numbers, score them individually? No, strategies score sets.
     * 
     * Hybrid approach:
     * Generate 100 random games.
     * Count frequency of numbers in the Top 10 games.
     * Pick the most frequent numbers.
     */
    private pickBestCandidates(config: LotteryConfig, count: number): number[] {
        const poolSize = count * 5; // Generate enough samples
        const sampleGames = this.generateSniper(config, 50); // Get 50 good games

        const freq = new Map<number, number>();
        for (const game of sampleGames) {
            for (const n of game.numbers) {
                freq.set(n, (freq.get(n) || 0) + 1);
            }
        }

        // Sort by frequency
        const sortedDetails = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);

        // Take top N
        const top = sortedDetails.slice(0, count).map(x => x[0]);

        // If not enough, fill with random
        while (top.length < count) {
            const r = Math.floor(Math.random() * config.totalNumbers) + 1;
            if (!top.includes(r)) top.push(r);
        }

        return top.sort((a, b) => a - b);
    }
}
